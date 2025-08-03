const Teachers = require('../Models/teacherModel');
const Users = require('../Models/userModel');
const Pages = require('../Models/pageModel')
const Progress = require('../Models/progressModel')
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
    const students = await Users.aggregate([
      { $match: { teacher: teacherId } },
      {
        $lookup: {
          from: "progresses",
          let: { student_id: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$studentId", "$$student_id"] }
              }
            },
            {
              $group: {
                _id: null,
                avgProgress: { $avg: "$progress" }
              }
            }
          ],
          as: "progressStats"
        }
      },
      {
        $addFields: {
          averageProgress: {
            $round: [
              {
                $ifNull: [{ $arrayElemAt: ["$progressStats.avgProgress", 0] },
                  0]
              },
              1
            ]

          }
        }
      },
      {
        $project: {
          username: 1,
          email: 1,
          userId: 1,
          averageProgress: 1
        }
      }
    ]);
    return res.status(200).json({ status: true, students });
  } catch (err) {
    console.error("Error fetching user pages:", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
}

module.exports.getLessonsWithProgress = async (req, res, next) => {
  if (req.role !== "teacher") {
    return res.status(403).json({ msg: "Access denied,Teacher's only", status: false });
  }

  const studentId = req.params.id;

  try {
    const lessons = await Pages.aggregate([
      // Step 1: Match lessons accessible by this student
      { $match: { userAccess: studentId } },

      // Step 2: Lookup progress from Progress collection
      {
        $lookup: {
          from: 'progresses', // note: MongoDB collection name (not model name)
          let: { lessonId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$lessonId', '$$lessonId'] },
                    { $eq: ['$studentId', studentId] }
                  ]
                }
              }
            },
            { $project: { progress: 1, _id: 0 } }
          ],
          as: 'studentProgress'
        }
      },

      // Step 3: Flatten progress if exists, or set to 0
      {
        $addFields: {
          progress: {
            $ifNull: [{ $arrayElemAt: ['$studentProgress.progress', 0] }, 0]
          }
        }
      },

      { $project: { studentProgress: 0 } } // Clean up
    ]);

    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons with progress', error });
  }

}

module.exports.updateProgress = async (req, res, next) => {

  if (req.role !== "teacher") {
    return res.status(403).json({ msg: "Access denied,Teacher's only", status: false });
  }

  const { studentId, lessonId, progress } = req.body;

  try {
    const progressUpdate = await Progress.updateOne(
      { studentId, lessonId }
      , { $set: { progress } },
      { upsert: true }
    )

    return res.status(200).json({ status: true, msg: "Progress updated", progressUpdate });
  } catch (err) {
    console.error("Error updating progress", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
}

