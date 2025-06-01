const express = require('express');
const router = express.Router();
const upload = require("../middleware/file-validator")
const { uploadVideo } = require('../controllers/upload.controller')

router.post('/upload', upload.single('video'), uploadVideo)

module.exports = router