
const {login,register,addPageLink, getPageLinks, updatePageLink,deletePageLink, getAllPages, addNewUser, getAllUsers, getSinglePage, authorizeUser, removerUserAccess} = require('../Controllers/adminController')
const router = require('express').Router();

router.post("/login", login);
router.post('/register', register);
router.post('/add-link', addPageLink)
router.get('/get-links', getPageLinks)
router.post('/update-links', updatePageLink)
router.post('/delete-link', deletePageLink)
router.get('/get-pages', getAllPages)
router.post('/add-user', addNewUser)
router.get('/get-users', getAllUsers)
router.get('/get-single-page/:id', getSinglePage)
router.post('/authorize', authorizeUser)
router.post('/remove-user-access', removerUserAccess)


module.exports = router;