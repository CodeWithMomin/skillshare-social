const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { summarizeText, summarizeDocument, chatbot, analyzeImage, birjuChat } = require('../controllers/aiController');

// Using purely memory storage for simplicity since it's just for extracting text
const upload = multer({ storage: multer.memoryStorage() });

router.post('/summarize', summarizeText);
router.post('/summarize-document', upload.single('document'), summarizeDocument);
router.post('/chat', protect, chatbot);
router.post('/birju', protect, birjuChat);
router.post('/analyze', analyzeImage);


module.exports = router;
