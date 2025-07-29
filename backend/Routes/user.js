
const { login, getPages, getPageDetails } = require('../Controllers/userController')
const router = require('express').Router();
const { authenticate } = require('../Middleware/authMiddleware');

router.post("/login", login);
router.get('/get-pages/:id', authenticate, getPages)
router.get('/get-page-details/:id', authenticate, getPageDetails)

module.exports = router;