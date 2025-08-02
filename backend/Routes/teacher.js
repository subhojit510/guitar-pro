
const {login, getStudents, getLessons} = require('../Controllers/teacherController')
const router = require('express').Router();
const {authenticate} = require('../Middleware/authMiddleware')

router.post("/login", login);
router.get('/get-students/:id',authenticate, getStudents);
router.get('/get-lessons/:id',authenticate, getLessons)

module.exports = router;