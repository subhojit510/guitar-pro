
const {login, getStudents, updateProgress, getLessonsWithProgress} = require('../Controllers/teacherController')
const router = require('express').Router();
const {authenticate} = require('../Middleware/authMiddleware')

router.post("/login", login);
router.get('/get-students/:id',authenticate, getStudents);
router.get('/get-lessons/:id',authenticate, getLessonsWithProgress);
router.post('/update-progress',authenticate, updateProgress );

module.exports = router;