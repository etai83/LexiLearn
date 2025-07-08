const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', upload.single('pdfFile'), quizController.generateQuiz);

module.exports = router;