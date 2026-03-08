const express = require('express');
const { upload } = require('../middleware/uploadMiddleware')

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
  addBasicInfo,
  updateBasicInfo,
  addCurrentPosition,
  updateCurrentPosition,
  deleteCurrentPostion,
  getAllUsers,
  getUserById,
  uploadProfilePhoto,
  connectUser,
  acceptConnection,
  declineConnection
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware')
// Public routes
router.get('/', getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes - Profile
router.get('/profile', protect, getUserProfile);
router.get('/user/:id', protect, getUserById);
router.post('/:id/connect', protect, connectUser);
router.post('/:id/accept', protect, acceptConnection);
router.post('/:id/decline', protect, declineConnection);
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
router.post('/:id/internships', protect, addInternships)
router.put('/internships/:internshipId', protect, updateInternships)
router.delete('/:id/internships/:internshipId', protect, deleteInternships)
// Protected Routes for Language
router.post('/:id/languages', protect, addLanguage)
router.put('/languages/:langId', protect, updateLanguage)
router.delete('/:id/languages/:langId', protect, deleteLanguage)
// Protected routes - Skills
router.post('/:id/skills', protect, addSkill);
router.put('/skills/:skillId', protect, updateSkill)
router.delete('/:id/skills/:skillId', protect, deleteSkill);



router.post('/:id/current', protect, addCurrentPosition);
router.put('/current/:currentPositionId', protect, updateCurrentPosition)
router.delete('/:id/current/:currentPositionId', protect, deleteCurrentPostion);

router.post('/:id/basicInfo', protect, addBasicInfo);
router.put('/basicInfo/:basicInfoId', protect, updateBasicInfo)

router.post(
  "/upload-profile-picture",
  protect,
  upload.single("profile"),
  uploadProfilePhoto
);

module.exports = router;
