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

