
const Admin = require('../Models/adminModel')
const Pages = require('../Models/pageModel')
const Users = require('../Models/userModel')
const Teachers = require('../Models/teacherModel')
const bcrypt = require('bcrypt');


module.exports.login = async (req, res, next) => {
    try {
        
        const { email, password } = req.body.formData;
        const admin = await Admin.findOne({email });
        if (!admin)
            return res.json({ msg: "Invalid Email", status: false });
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid)
            return res.json({ msg: "Invalid Password", status: false });
        const adminfilter = await Admin.findOne({ email }).select("email");
        delete admin.password 
        return res.json({ status: true, adminfilter })
    } catch (err) {
        console.log("An error occured in user login", err);
    }
}

module.exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body.formData;
        console.log(name);
        
        const emailCheck = await Admin.findOne({ name,email });
        if (emailCheck)
            return res.json({ msg: "Email already exist", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Admin.create({
            name,
            email,
            password: hashedPassword
        });
        delete user.password;
        return res.json({ status: true, user })
    } catch (err) {
        console.log("An error occured in admin register", err);
    }
}

module.exports.addPageLink = async (req, res, next) => {
    try {
        const googleLink = req.body.newLink
        const linkExist = await Pages.findOne({googleLink})
        if(linkExist){
            return res.json({status: false, msg: "Link already exist"})
        }
          const page = await Pages.create({
            name: req.body.newName,
            googleLink
        });

        return res.json({status:true, page})
    } catch (err) {
        console.log("An error occured in adding new page/link", err);
    }
}

module.exports.getPageLinks = async (req, res, next) => {
    try {
        const pages =await Pages.find()
        return res.json({status:true, pages})
    } catch (err) {
        console.log("An error occured in updating page/link", err);
    }
}

module.exports.updatePageLink = async (req, res, next) => {
    try {
        console.log(req.body.id)
        const updatedPage = await Pages.findByIdAndUpdate(
      req.body.id,
      {
        name: req.body.name,
        googleLink: req.body.googleLink
      },
      { new: true } // returns updated doc
    );

    return res.json({status:true})
    } catch (err) {
        console.log("An error occured in updating page/link", err);
    }
}

module.exports.deletePageLink= async (req, res, next) => {
    try {
        const updated = await Pages.findByIdAndDelete(req.body.id);
        return res.json({status: true})
    } catch (err) {
        console.log("An error occured in deleting page/link", err);
    }
}

module.exports.getAllPages= async (req, res, next) => {
    try {
        const pages = await Pages.find()
        return res.json({status: true, pages})
    } catch (err) {
        console.log("An error occured in deleting page/link", err);
    }
}


module.exports.addNewUser= async (req, res, next) => {
     try {
        const email = req.body.email
        const userId = req.body.userId
        const username = req.body.username
        const password = req.body.password
        const userIdCheck = await Users.findOne({ userId });
        if (userIdCheck)
            return res.json({ msg: "User already exist", status: false });
        const emailCheck = await Users.findOne({email})
        if(emailCheck)
            return res.json({ msg: "Email already exist", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({
            userId,
            username,
            email,
            password: hashedPassword
        });
        const userfilter = await Users.findOne({ userId }).select("userId username email ");
        delete user.password;
        return res.json({ status: true, userfilter })
    } catch (err) {
        console.log("An error occured in user register", err);
    }
}

module.exports.addNewTeacher = async (req, res, next) => {
     try {
        const email = req.body.email
        const teacherId = req.body.teacherId
        const name = req.body.teacherName
        const password = req.body.password
        const teacherIdCheck = await Teachers.findOne({ teacherId });
        if (teacherIdCheck)
            return res.json({ msg: "Teacher already exist", status: false });
        const emailCheck = await Users.findOne({email})
        if(emailCheck)
            return res.json({ msg: "Email already exist", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = await Teachers.create({
            teacherId,
            name,
            email,
            password: hashedPassword
        });
        const teacherFilter = await Teachers.findOne({ teacherId }).select("teacherId name email ");
        delete teacher.password;
        return res.json({ status: true, teacherFilter })
    } catch (err) {
        console.log("An error occured in teacher register", err);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
     try {
        const users = await Users.find();
        return res.json({status:true, users})
    } catch (err) {
        console.log("An error occured in user register", err);
    }
}

module.exports.getAllTeachers = async (req, res, next) => {
     try {
        const teachers = await Teachers.find();
        return res.json({status:true, teachers})
    } catch (err) {
        console.log("An error occured in user register", err);
    }
}


module.exports.getSinglePage = async (req, res, next) => {
   try { 
    const page = await Pages.findById(req.params.id);
    if (!page) return res.status(404).json({ msg: "Page not found" });

    res.json({ status: true, page });
  } catch (err) {
    res.status(500).json({ status: false, msg: "Server error" });
  }
}

module.exports.authorizeUser = async (req, res, next) => {
  const { pageId, userId } = req.body;

  if (!pageId || !userId) {
    return res.status(400).json({ status: false, msg: "Missing parameters" });
  }

  try {
    const page = await Pages.findById(pageId);
    if (!page) return res.status(404).json({ status: false, msg: "Page not found" });

    if (!page.userAccess.includes(userId)) {
      page.userAccess.push(userId);
      await page.save();
    }

    res.json({ status: true, msg: "User authorized" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: "Server error" });
  }
}

module.exports.removerUserAccess = async (req, res, next) => {
  const { pageId, userId } = req.body;

  if (!pageId || !userId) {
    return res.status(400).json({ status: false, msg: "Missing parameters" });
  }

  try {
    const page = await Pages.findById(pageId);
    if (!page) return res.status(404).json({ status: false, msg: "Page not found" });

    page.userAccess = page.userAccess.filter(id => id !== userId);
    await page.save();

    res.json({ status: true, msg: "Access removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: "Server error" });
  }
}


