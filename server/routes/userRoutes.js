const express = require('express');
const upload = require("../config/upload");
const { uploadProfilePicture } = require("../controllers/userController");


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
    updateSkill,
    addLanguage,
    deleteLanguage,
    updateLanguage,
    addInternships,
    updateInternships,
    deleteInternships,
    addCurrentPosition,
    updateCurrentPosition,
    deleteCurrentPostion,
    addBasicInfo,
    updateBasicInfo
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
router.put('/education/:id', protect, updateEducation);
router.delete('/:id/education/:eduId', protect, deleteEducation);

// Protected routes - Experience
router.get('/:id/experience', protect, getExperience);
router.post('/:id/experience', protect, addExperience);
router.put('/experience/:id', protect, updateExperience);
router.delete('/:id/experience/:expId', protect, deleteExperience);

//Protected Routes -Internships
router.post('/:id/internships',protect,addInternships)
router.put('/internships/:internshipId',protect,updateInternships)
router.delete('/:id/internships/:internshipId',protect,deleteInternships)
// Protected Routes for Language
router.post('/:id/languages',protect,addLanguage)
router.put('/languages/:langId',protect,updateLanguage)
router.delete('/:id/languages/:langId',protect,deleteLanguage)
// Protected routes - Skills
router.post('/:id/skills', protect, addSkill);
router.put('/skills/:skillId',protect,updateSkill)
router.delete('/:id/skills/:skillId', protect, deleteSkill);
// Protected routes - Current  positions
router.post('/:id/current', protect, addCurrentPosition);
router.put('/current/:currentPositionId',protect,updateCurrentPosition)
router.delete('/:id/current/:currentPositionId', protect, deleteCurrentPostion);
  
router.post('/:id/basicInfo', protect, addBasicInfo);
router.put('/basicInfo/:basicInfoId',protect,updateBasicInfo)


router.post(
  '/upload-profile-picture',
  protect,
  upload.single('profile'),
  uploadProfilePicture
);

module.exports = router;
