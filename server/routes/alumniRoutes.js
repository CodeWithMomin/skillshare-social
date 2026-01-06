const express=require('express')
const alumniRouter=express.Router()
const { registerUser,
    loginUser,
    getAlumniProfile,
    addAlumniBasicInfo,
    updateAlumniBasicInfo,
    addAcademics,
    updateAcademics,
    deleteAcademics,
    addLanguage,
    deleteLanguage,
    updateLanguage,
    addAcheivement,
    deleteAcheivement,
    updateAcheivement,
    addAlumniInfo,
    deleteAlumniInfo,
    updateAlumniInfo,addSkill,updateSkill,deleteSkill}=require('../controllers/alumniUserController')
 const {alumniProtect}=require('../middleware/alumniAuthMiddleware')
alumniRouter.post('/register',registerUser)
alumniRouter.post('/login',loginUser)
 
// Basic Info
alumniRouter.post("/basicinfo",alumniProtect,addAlumniBasicInfo)
alumniRouter.put("/basicinfo/:basicInfoId",alumniProtect,updateAlumniBasicInfo)

//Academics

alumniRouter.post("/academics",alumniProtect,addAcademics)
alumniRouter.put("/academics/:academicId",alumniProtect,updateAcademics)
alumniRouter.delete("/academics/:eduId",alumniProtect,deleteAcademics)

//language
alumniRouter.post("/language",alumniProtect,addLanguage)
alumniRouter.put("/language/:langId",alumniProtect,updateLanguage)
alumniRouter.delete("/language/:langId",alumniProtect,deleteLanguage)

//skills
alumniRouter.post("/skill",alumniProtect,addSkill)
alumniRouter.put("/skill/:skillId",alumniProtect,updateSkill)
alumniRouter.delete("/skill/:skillId",alumniProtect,deleteSkill)

//Acheivement

alumniRouter.post("/acheivement",alumniProtect,addAcheivement)
alumniRouter.put("/acheivement/:acheivementId",alumniProtect,updateAcheivement)
alumniRouter.delete("/acheivement/:acheivementId",alumniProtect,deleteAcheivement)

//Alumni Information
alumniRouter.post("/alumniinfo",alumniProtect,addAlumniInfo)
alumniRouter.put("/alumniinfo/:alumniId",alumniProtect,updateAlumniInfo)
alumniRouter.delete("/alumniinfo/:alumniId",alumniProtect,deleteAlumniInfo)

module.exports=alumniRouter