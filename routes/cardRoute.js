const express = require('express');
const multer = require('multer');
const {
    Upload, Cards
} = require('../controller/cardDetailsController');

const router = express.Router();

// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });


var upload = multer({ dest: 'uploads/' });

router.post('/upload',upload.single('file'), Upload);
router.get('/cards', Cards)

module.exports = router;
