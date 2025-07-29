const Users = require('../Models/userModel')
const Pages = require('../Models/pageModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hP1@A#s8kL3!zYx7R$9wUeVmTq2N'; /// must be changed later

module.exports.login = async (req, res, next) => {
  try {
    const { userId, email, password } = req.body.formData;
    const user = await Users.findOne({ userId });
    if (!user)
      return res.json({ msg: "Invalid UserId", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return res.json({ msg: "Invalid Password", status: false });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    const userfilter = {
      username: user.username,
      email: user.email,
      id: user._id,
      userId: user.userId,
    }
    delete user.password
    return res.json({ status: true, user: userfilter, token })
  } catch (err) {
    console.log("An error occured in user login", err);
  }
}

module.exports.getPages = async (req, res, next) => {
  if (req.role !== "user") {
    return res.status(403).json({ msg: "Access denied,Users only", status: false });
  }
  const userId = req.params.id;
  try {
    const pages = await Pages.find({
      userAccess: userId
    });

    return res.status(200).json({ status: true, pages });
  } catch (err) {
    console.error("Error fetching user pages:", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
}

module.exports.getPageDetails = async (req, res, next) => {
  const googleLink = req.params.id

  try {
    const page = await Pages.findOne({ googleLink });
    return res.status(200).json({ status: true, page });
  } catch (err) {
    console.error("Error fetching page details:", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
}

