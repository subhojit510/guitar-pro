
const {login, getStudents} = require('../Controllers/teacherController')
const router = require('express').Router();

router.post("/login", login);
router.get('/get-students/:id', getStudents);
// router.get('/get-page-details/:id', getPageDetails)

module.exports = router;