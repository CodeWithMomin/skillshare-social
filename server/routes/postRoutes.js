const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, commentPost, uploadPostMedia, updatePost, deletePost } = require('../controllers/postController');
const { postUpload } = require('../middleware/uploadMiddleware');

router.route('/').post(createPost).get(getPosts);
router.route('/:id').put(updatePost).delete(deletePost);
router.route('/:id/like').post(likePost);
router.route('/:id/comment').post(commentPost);

router.post('/upload-media', postUpload.single('media'), uploadPostMedia);

module.exports = router;
