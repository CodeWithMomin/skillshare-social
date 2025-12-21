const express=require('express')
const alumniRouter=express.Router()
const {registerUser,loginUser}=require('../controllers/alumniUserController')
// const {alumniProtect}=require('../middleware/alumniAuthMiddleware')
alumniRouter.post('/register',registerUser)
alumniRouter.post('/login',loginUser)


module.exports=alumniRouter