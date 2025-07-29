
const {login, getPages, getPageDetails} = require('../Controllers/userController')
const router = require('express').Router();

router.post("/login", login);
router.get('/get-pages/:id', getPages)
router.get('/get-page-details/:id', getPageDetails)

module.exports = router;