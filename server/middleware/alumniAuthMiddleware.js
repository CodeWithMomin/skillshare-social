const jwt=require('jsonwebtoken')
const Alumni=require('../models/AlumniUserModel')

const alumniProtect=async(req,res,next)=>{
    let alumni_token;
    if(
          req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            alumni_token=req.headers.authorization.split(' ')[1]
            const decoded=jwt.verify(alumni_token,process.env.JWT_SECRET)
            req.user=await Alumni.findById(decoded._id).select('-password')
            next();
        } catch (error) {
              res.status(401).json({
                message:"Not Authorized,token failed"
            })
        }
    }
    if(!alumni_token){
         return res.status(401).json({
                message:"Not Authorized,no token"
            })
    }
}
module.exports={alumniProtect}