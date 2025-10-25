const express = require('express');
const { registerUser,loginUser,getUserProfile }=require('../controllers/userController')
const router = express.Router();
const {protect}=require('../middleware/authMiddleware')
// Public routes (no authentication needed)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes (authentication required - need token)
router.get('/profile', protect, getUserProfile);
// router.put('/profile', protect, updateUserProfile);

module.exports = router;
