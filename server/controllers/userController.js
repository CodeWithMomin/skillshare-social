// register user
const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const genrationToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
}


const registerUser=async (req,res)=>{
    //400 -: Bad Request
    // salt-: gives us random string 
    try{
        const{fullName,email,password}=req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({
              message:  "Please Provide all the detials"
            });
        }

        const userExists=await User.findOne({email})
        if(userExists){
            return res.status(400).json({
                message:"User Already Exists with this email"
            })
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const user=await User.create({
            fullName,
            email,
            password:hashedPassword
        })
        if(user){
            res.status(201).json({
                success:true,
                message:"user registered successfully",
                user:{
                    _id:user._id,
                    fullName:user.fullName,
                    email:user.email,
                    token:genrationToken(user._id)
                }
            });
        } else{
            res.status(400).json({
                message:"Invalid user Data"
            })
        }

    } catch(error){
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })
    }
}



const loginUser= async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Please provide email and password"
            });
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            });

        }
        const isPasswordMatch=await bcrypt.compare(password,user.password)
        if(isPasswordMatch){
            res.status(200).json({
                message:'Login Successfully',
                user:{
                    _id:user._id,
                    fullName:user.fullName,
                    email:user.email,
                    token:genrationToken(user._id)
                }
            });
        } else{
            res.status(401).json({
                message:"Invalid email or password"
            });
        }
    } catch(error){
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })
    }
}



const getUserProfile=async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password')
        if (user) {
      res.json({
        success: true,
        user
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};