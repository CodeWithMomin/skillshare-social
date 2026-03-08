const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getConversations,
    getConversation,
    saveConversation,
    deleteConversation,
} = require('../controllers/chatHistoryController');

router.use(protect); // all routes require auth

router.get('/', getConversations);
router.get('/:id', getConversation);
router.post('/', saveConversation);
router.delete('/:id', deleteConversation);

module.exports = router;
