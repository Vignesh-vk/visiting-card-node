const express = require('express');
const multer = require('multer');
const {
    Upload, Cards
} = require('../controller/cardDetailsController');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload',upload.single('file'), Upload);
router.get('/cards', Cards)

module.exports = router;
