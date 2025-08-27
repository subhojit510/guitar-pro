
const { login,
    register,
    addPageLink,
    getPageLinks,
    updatePageLink,
    deletePageLink,
    getAllPages,
    addNewUser,
    addNewTeacher,
    getAllUsers,
    getSinglePage,
    authorizeUser,
    removerUserAccess,
    getAllTeachers,
    authorizeTeacher,
    unAssignTeacher,
    scheduleClass,
    updateNextPayment,
    getAssignedLessons,
    deleteStudent,
    deleteTeacher
} = require('../Controllers/adminController');
const { authenticate } = require('../Middleware/authMiddleware');
const router = require('express').Router();

router.post("/login", login);
// router.post('/register', register);
router.post('/add-link',authenticate, addPageLink)
router.get('/get-links',authenticate, getPageLinks)
router.post('/update-links',authenticate, updatePageLink)
router.post('/delete-link',authenticate, deletePageLink)
router.get('/get-pages',authenticate, getAllPages)
router.get('/get-assigned-lessons',authenticate, getAssignedLessons)
router.post('/add-user',authenticate, addNewUser)
router.post('/add-teacher',authenticate, addNewTeacher)
router.get('/get-users',authenticate, getAllUsers)
router.get('/get-teachers',authenticate, getAllTeachers)
router.get('/get-single-page/:id',authenticate, getSinglePage)
router.post('/authorize',authenticate, authorizeUser)
router.post('/remove-user-access',authenticate, removerUserAccess)
router.post('/assign-teacher',authenticate, authorizeTeacher)
router.post('/unassign-teacher',authenticate, unAssignTeacher)
router.post('/schedule-class', authenticate, scheduleClass)
router.post('/update-next-payment', authenticate, updateNextPayment)
router.post('/delete-student', authenticate, deleteStudent)
router.post('/delete-teacher', authenticate, deleteTeacher)


module.exports = router;