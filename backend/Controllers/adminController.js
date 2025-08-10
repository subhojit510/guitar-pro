
const Admin = require('../Models/adminModel')
const Pages = require('../Models/pageModel')
const Users = require('../Models/userModel')
const Teachers = require('../Models/teacherModel')
const Class = require('../Models/classesModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AssignedLessons = require('../Models/assignedLessons')

const JWT_SECRET = process.env.JWT_SECRET || 'hP1@A#s8kL3!zYx7R$9wUeVmTq2N'; /// must be changed later

module.exports.login = async (req, res, next) => {
    try {

        const { email, password } = req.body.formData;

        const admin = await Admin.findOne({ email });
        if (!admin)
            return res.json({ msg: "Invalid Email", status: false });

        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid)
            return res.json({ msg: "Invalid Password", status: false });

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        const adminfilter = {
            email: admin.email,
            id: admin._id
        }

        delete admin.password

        return res.json({ status: true, admin: adminfilter, token })
    } catch (err) {
        console.log("An error occured in user login", err);
    }
}

module.exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body.formData;

        const emailCheck = await Admin.findOne({ name, email });
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
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
        const googleLink = req.body.newLink
        const about = req.body.newAbout
        const linkExist = await Pages.findOne({ googleLink })
        if (linkExist) {
            return res.json({ status: false, msg: "Link already exist" })
        }
        const page = await Pages.create({
            name: req.body.newName,
            googleLink,
            about
        });

        return res.json({ status: true, page })
    } catch (err) {
        console.log("An error occured in adding new page/link", err);
    }
}

module.exports.getPageLinks = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
        const pages = await Pages.find()
        return res.json({ status: true, pages })
    } catch (err) {
        console.log("An error occured in updating page/link", err);
    }
}

module.exports.updatePageLink = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
       await Pages.findByIdAndUpdate(
            req.body.id,
            {
                name: req.body.name,
                googleLink: req.body.googleLink,
                about: req.body.about
            },
            { new: true } // returns updated doc
        );

        return res.json({ status: true })
    } catch (err) {
        console.log("An error occured in updating page/link", err);
    }
}

module.exports.deletePageLink = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
        await Pages.findByIdAndDelete(req.body.id);
        await AssignedLessons.deleteMany({lessonId: req.body.id});
        return res.json({ status: true })
    } catch (err) {
        console.log("An error occured in deleting page/link", err);
    }
}

module.exports.getAllPages = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }

    try {
        const pages = await Pages.find();
        return res.json({ status: true, pages })
    } catch (err) {
        console.log("An error occured in deleting page/link", err);
    }
}

module.exports.getAssignedLessons = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }

    try {
        const assignedLessons = await AssignedLessons.find();
        
        return res.json({ status: true, assignedLessons })
    } catch (err) {
        console.log("An error occured in deleting page/link", err);
    }
}


module.exports.addNewUser = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
        const email = req.body.email
        const userId = req.body.userId
        const username = req.body.username
        const password = req.body.password
        const userIdCheck = await Users.findOne({ userId });
        if (userIdCheck)
            return res.json({ msg: "User already exist", status: false });
        const emailCheck = await Users.findOne({ email })
        if (emailCheck)
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
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
        const email = req.body.email
        const teacherId = req.body.teacherId
        const name = req.body.teacherName
        const password = req.body.password
        const teacherIdCheck = await Teachers.findOne({ teacherId });
        if (teacherIdCheck)
            return res.json({ msg: "Teacher already exist", status: false });
        const emailCheck = await Users.findOne({ email })
        if (emailCheck)
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
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
        const users = await Users.find();
        return res.json({ status: true, users })
    } catch (err) {
        console.log("An error occured in user register", err);
    }
}

module.exports.getAllTeachers = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
        const teachers = await Teachers.find();
        return res.json({ status: true, teachers })
    } catch (err) {
        console.log("An error occured in user register", err);
    }
}


module.exports.getSinglePage = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    try {
        const page = await Pages.findById(req.params.id);
        if (!page) return res.status(404).json({ msg: "Page not found" });

        res.json({ status: true, page });
    } catch (err) {
        res.status(500).json({ status: false, msg: "Server error" });
    }
}

module.exports.authorizeUser = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    const { pageId, userId } = req.body;

    if (!pageId || !userId) {
        return res.status(400).json({ status: false, msg: "Missing parameters" });
    }

    try {
        const page = await Pages.findById(pageId);
        if (!page) return res.status(404).json({ status: false, msg: "Page not found" });
        if (!pageId || !userId) {
            return res.status(400).json({ status: false, msg: "Missing parameters" });
        }

        // if (!page.userAccess.includes(userId)) {
        //     page.userAccess.push(userId);
        //     await page.save();
        // }
        await AssignedLessons.create({
            studentId: userId,
            lessonId: pageId,
        })

        res.json({ status: true, msg: "User authorized" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}

module.exports.removerUserAccess = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    const { pageId, userId } = req.body;

    if (!pageId || !userId) {
        return res.status(400).json({ status: false, msg: "Missing parameters" });
    }

    try {
        const page = await Pages.findById(pageId);
        if (!page) return res.status(404).json({ status: false, msg: "Page not found" });

        await AssignedLessons.deleteOne({
            studentId: userId, lessonId: pageId
        })

        res.json({ status: true, msg: "Access removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}

module.exports.authorizeTeacher = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    const { teacherId, userId } = req.body;

    if (!teacherId || !userId) {
        return res.status(400).json({ status: false, msg: "Missing parameters" });
    }
    try {
        const updatedStudent = await Users.findOneAndUpdate(
            { userId: userId },
            { teacher: teacherId },
            { new: true, upsert: false }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ status: true, msg: "Teacher authorized" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}

module.exports.unAssignTeacher = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied,Admins only", status: false });
    }
    const { teacherId, userId } = req.body;

    if (!teacherId || !userId) {
        return res.status(400).json({ status: false, msg: "Missing parameters" });
    }
    try {
        const updatedStudent = await Users.findOneAndUpdate(
            { userId: userId },
            { teacher: null },
            { new: true, upsert: false }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ status: true, msg: "Teacher unassigned" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}

module.exports.scheduleClass = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied, Admins only", status: false });
    }
    try {
        const { title, date, time, studentId, teacherId } = req.body;

        await Class.create({
            title,
            studentId,
            teacherId,
            date,
            time
        })

        return res.status(200).json({ status: true, msg: "Class scheduled" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}

module.exports.updateNextPayment = async (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Access denied, Admins only", status: false });
    }
    try {
        const { studentId, date } = req.body;

        await Users.findOneAndUpdate({ userId: studentId },
            { nextPayment: date }
        )

        return res.status(200).json({ status: true, msg: "Next payment date updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}

