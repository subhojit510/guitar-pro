const Users = require('../Models/userModel')
const Pages = require('../Models/pageModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { log } = require('node:console');

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
      nextPayment : user.nextPayment
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
  
   const studentId = req.params.id;
  
    try {
      const lessons = await Pages.aggregate([
        // Step 1: Match lessons accessible by this student
        { $match: { userAccess: studentId } },
  
        // Step 2: Lookup progress from Progress collection
        {
          $lookup: {
            from: 'progresses', // note: MongoDB collection name (not model name)
            let: { lessonId: '$_id'},
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
      res.status(200).json({ status: true, lessons });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lessons with progress', error });
    }
}

module.exports.getPageDetails = async (req, res, next) => {
  const googleLink = req.params.id
  const role = req.role;

  try {
    const page = await Pages.findOne({ googleLink });
    return res.status(200).json({ status: true, page, role });
  } catch (err) {
    console.error("Error fetching page details:", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
}

