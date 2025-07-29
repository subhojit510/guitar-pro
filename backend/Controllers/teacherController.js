const Teachers = require('../Models/teacherModel');
const Users = require('../Models/userModel');
const bcrypt = require('bcrypt');


module.exports.login = async (req, res, next) => {
    try {     
        const { teacherId, email, password } = req.body.formData;
        const teacher = await Teachers.findOne({ teacherId });
        if (!teacher)
            return res.json({ msg: "Invalid Teacher Id", status: false });
        const isPasswordValid = await bcrypt.compare(password, teacher.password)
        if (!isPasswordValid)
            return res.json({ msg: "Invalid Password", status: false });
        const teacherfilter = await Teachers.findOne({teacherId }).select("teacherId name email createdAt");
        delete teacher.password
        return res.json({ status: true, teacherfilter })
    } catch (err) {
        console.log("An error occured in teacher login", err);
    }
}

module.exports.getStudents = async (req, res, next) => {
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

