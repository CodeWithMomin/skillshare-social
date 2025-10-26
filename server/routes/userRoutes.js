const express = require('express');

const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    completeProfile,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    deleteSkill
} = require('../controllers/userController');
const {protect}=require('../middleware/authMiddleware')
// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes - Profile
router.get('/profile', protect, getUserProfile);
router.put('/profile/complete', protect, completeProfile);

// Protected routes - Education
router.post('/education', protect, addEducation);
router.put('/education/:id', protect, updateEducation);
router.delete('/education/:id', protect, deleteEducation);

// Protected routes - Experience
router.post('/experience', protect, addExperience);
router.put('/experience/:id', protect, updateExperience);
router.delete('/experience/:id', protect, deleteExperience);

// Protected routes - Skills
router.post('/skills', protect, addSkill);
router.delete('/skills/:id', protect, deleteSkill);

module.exports = router;
