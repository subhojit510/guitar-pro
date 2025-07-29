const Users = require('../Models/userModel')
const Pages = require('../Models/pageModel')
const bcrypt = require('bcrypt');


module.exports.login = async (req, res, next) => {
    try {     
        const { userId, email, password } = req.body.formData;
        const user = await Users.findOne({ userId });
        if (!user)
            return res.json({ msg: "Invalid UserId", status: false });
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid)
            return res.json({ msg: "Invalid Password", status: false });
        const userfilter = await Users.findOne({ userId }).select("userId username email createdAt");
        delete user.password
        return res.json({ status: true, userfilter })
    } catch (err) {
        console.log("An error occured in user login", err);
    }
}

module.exports.getPages = async (req, res, next) => {
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
    const page = await Pages.findOne({googleLink});
    return res.status(200).json({ status: true, page });
  } catch (err) {
    console.error("Error fetching page details:", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
}

