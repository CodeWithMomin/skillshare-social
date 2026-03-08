const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, commentPost, uploadPostMedia, updatePost, deletePost } = require('../controllers/postController');
const { postUpload } = require('../middleware/uploadMiddleware');

const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createPost).get(protect, getPosts);
router.route('/:id/like').post(protect, likePost);
router.route('/:id/comment').post(protect, commentPost);

router.post('/upload-media', protect, postUpload.single('media'), uploadPostMedia);

module.exports = router;
