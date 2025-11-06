const express = require('express');
const {upload}=require('../middleware/uploadMiddleware')

const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    completeProfile,
    getEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    getExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    deleteSkill,
    uploadProfilePhoto,
} = require('../controllers/userController');
const {protect}=require('../middleware/authMiddleware')
// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes - Profile
router.get('/profile', protect, getUserProfile);
// Upload route, single file with key 'photo'
// router.post('/upload-profile-photo', upload.single('photo'), uploadProfilePhoto);
router.put('/profile/complete', protect, completeProfile);

// Protected routes - Education
router.get('/:id/education', protect, getEducation);
router.post('/:id/education', protect, addEducation);
router.put('/:id/education/:eduId', protect, updateEducation);
router.delete('/:id/education/:eduId', protect, deleteEducation);

// Protected routes - Experience
router.get('/:id/experience', protect, getExperience);
router.post('/:id/experience', protect, addExperience);
router.put('/experience/:id', protect, updateExperience);
router.delete('/experience/:id', protect, deleteExperience);

// Protected routes - Skills
router.post('/skills', protect, addSkill);
router.delete('/skills/:id', protect, deleteSkill);

module.exports = router;
