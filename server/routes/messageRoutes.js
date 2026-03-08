const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessages, getUnreadCounts, deleteMessage } = require('../controllers/messageController');
const { chatUpload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/unread-counts', protect, getUnreadCounts);
router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, chatUpload.single('image'), sendMessage);
router.delete('/:messageId', protect, deleteMessage);

module.exports = router;
