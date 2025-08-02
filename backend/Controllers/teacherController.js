const Teachers = require('../Models/teacherModel');
const Users = require('../Models/userModel');
const Pages = require('../Models/pageModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'hP1@A#s8kL3!zYx7R$9wUeVmTq2N'; /// must be changed later

module.exports.login = async (req, res, next) => {
    try {     
        const { teacherId, email, password } = req.body.formData;
        const teacher = await Teachers.findOne({ teacherId });
        if (!teacher)
            return res.json({ msg: "Invalid Teacher Id", status: false });
        const isPasswordValid = await bcrypt.compare(password, teacher.password)
        if (!isPasswordValid)
            return res.json({ msg: "Invalid Password", status: false });

        const token = jwt.sign(
              { id: teacher._id, email: teacher.email, role: 'teacher' },
              JWT_SECRET,
              { expiresIn: '1d' }
            )
        
            const teacherfilter = {
              teachername: teacher.name,
              email: teacher.email,
              id: teacher._id,
              teacherId: teacher.teacherId,
            }

        delete teacher.password
        return res.json({ status: true, teacher: teacherfilter, token })
    } catch (err) {
        console.log("An error occured in teacher login", err);
    }
}

module.exports.getStudents = async (req, res, next) => {
   if (req.role !== "teacher") {
        return res.status(403).json({ msg: "Access denied,Teacher's only", status: false });
    }
    const teacherId = req.params.id;
  try {
    const students = await Users.find({
      teacher: teacherId
    });
    return res.status(200).json({ status: true, students });
  } catch (err) {
    console.error("Error fetching user pages:", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
}

module.exports.getLessons = async (req, res, next) => {
   if (req.role !== "teacher") {
        return res.status(403).json({ msg: "Access denied,Teacher's only", status: false });
    }
    
    const studentId = req.params.id;
    
  try {
    const lessons = await Pages.find({
      userAccess: studentId,
    });
    
    return res.status(200).json({ status: true, lessons });
  } catch (err) {
    console.error("Error fetching user pages:", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
}

