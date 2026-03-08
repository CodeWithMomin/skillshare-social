const ChatHistory = require('../models/ChatHistory');

/* ── GET all conversations for the logged-in user ── */
const getConversations = async (req, res) => {
    try {
        const conversations = await ChatHistory.find({ user: req.user._id })
            .select('title createdAt updatedAt messages')
            .sort({ updatedAt: -1 })
            .lean();

        // Return lightweight list (no full message content for list view)
        const list = conversations.map((c) => ({
            _id: c._id,
            title: c.title,
            preview: c.messages?.[0]?.content?.slice(0, 80) || '',
            messageCount: c.messages?.length || 0,
            updatedAt: c.updatedAt,
            createdAt: c.createdAt,
        }));

        res.status(200).json(list);
    } catch (err) {
        console.error('getConversations error:', err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

/* ── GET a single conversation (full messages) ── */
const getConversation = async (req, res) => {
    try {
        const chat = await ChatHistory.findOne({ _id: req.params.id, user: req.user._id });
        if (!chat) return res.status(404).json({ error: 'Conversation not found' });
        res.status(200).json(chat);
    } catch (err) {
        console.error('getConversation error:', err);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
};

/* ── POST — save / update a conversation ── */
const saveConversation = async (req, res) => {
    try {
        const { conversationId, messages } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'No messages to save' });
        }

        // Auto-generate title from first user message (max 60 chars)
        const firstUserMsg = messages.find((m) => m.role === 'user');
        const title = firstUserMsg
            ? firstUserMsg.content.slice(0, 60) + (firstUserMsg.content.length > 60 ? '…' : '')
            : 'New Chat';

        // Strip large data URLs from previewUrl before saving
        const cleanMessages = messages.map((msg) => ({
            ...msg,
            // Only save a flag if there was an image, not the full base64
            previewUrl: msg.previewUrl ? '[image]' : undefined,
        }));

        let chat;
        if (conversationId) {
            // Update existing
            chat = await ChatHistory.findOneAndUpdate(
                { _id: conversationId, user: req.user._id },
                { messages: cleanMessages, title },
                { new: true }
            );
            if (!chat) return res.status(404).json({ error: 'Conversation not found' });
        } else {
            // Create new
            chat = await ChatHistory.create({
                user: req.user._id,
                title,
                messages: cleanMessages,
            });
        }

        res.status(200).json({ _id: chat._id, title: chat.title, updatedAt: chat.updatedAt });
    } catch (err) {
        console.error('saveConversation error:', err);
        res.status(500).json({ error: 'Failed to save conversation' });
    }
};

/* ── DELETE a conversation ── */
const deleteConversation = async (req, res) => {
    try {
        const result = await ChatHistory.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!result) return res.status(404).json({ error: 'Conversation not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('deleteConversation error:', err);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
};

module.exports = { getConversations, getConversation, saveConversation, deleteConversation };
