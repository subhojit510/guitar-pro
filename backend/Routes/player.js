
const {getDriveFile} = require('../Controllers/playerController')
const router = require('express').Router();

router.post("/file", getDriveFile);

module.exports = router;