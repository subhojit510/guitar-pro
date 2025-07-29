
const {login, getStudents} = require('../Controllers/teacherController')
const router = require('express').Router();
const {authenticate} = require('../Middleware/authMiddleware')

router.post("/login", login);
router.get('/get-students/:id',authenticate, getStudents);
// router.get('/get-page-details/:id', getPageDetails)

module.exports = router;