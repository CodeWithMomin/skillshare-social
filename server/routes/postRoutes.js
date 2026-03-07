const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, commentPost } = require('../controllers/postController');

router.route('/').post(createPost).get(getPosts);
router.route('/:id/like').post(likePost);
router.route('/:id/comment').post(commentPost);

module.exports = router;
