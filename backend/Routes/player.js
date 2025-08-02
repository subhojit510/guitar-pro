
const {getDriveFile} = require('../Controllers/playerController')
const router = require('express').Router();
const {authenticate} = require('../Middleware/authMiddleware')

router.post("/file",authenticate, getDriveFile);

module.exports = router;