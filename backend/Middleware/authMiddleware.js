const jwt = require("jsonwebtoken");
const Admin = require("../Models/adminModel");
const Teacher = require("../Models/teacherModel");
const User = require("../Models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || 'hP1@A#s8kL3!zYx7R$9wUeVmTq2N'; // change later to env

module.exports.authenticate = async (req, res, next) => {
 
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided", status: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔍 Identify role (assumes you added `role` in token payload)
    let user;
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === "teacher") {
      user = await Teacher.findById(decoded.id).select("-password");
    } else if (decoded.role === "user") {
      user = await User.findById(decoded.id).select("-password");
    }

    if (!user) return res.status(401).json({ msg: "Invalid token user", status: false });

    req.user = user; // attach user data to request
    req.role = decoded.role; // for role-based routes
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid or expired", status: false });
  }
};
