const Alumni=require('../models/AlumniUserModel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
// const { sendWelcomeAlumniEmail } = require("../utils/mailer");
const {sendWelcomeAlumniEmail}=require('../utilis/mailer')
const alumniTokenGenration=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,
        {expiresIn:'30d'});
}

const registerUser=async(req,res)=>{
    console.log(req.body);
    
    try {
        const {email,password,userType}=req.body;
        if(!email|| !password|| !userType){
            return res.status(400).json({ // 400-means Bad Request
                message:"Please Provide All the Details ."
            })
        }

        const userExists= await Alumni.findOne({email})
        if(userExists){
            return res.status(400).json({ // 400-means Bad Request
                message:"User already added with this email."
            })
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=await Alumni.create({
            email,
            password:hashedPassword,
            userType
        })
        if(newUser){
            res.status(201).json({
                success:true,
                message:"User Registered Successfully.",
                user: {
        _id: newUser._id,
        
        email: newUser.email,
        userType: newUser.userType,
        alumni_token: alumniTokenGenration(newUser._id, newUser.role),
      },
            })

            await sendWelcomeAlumniEmail(email,password)
        } else{
            res.status(400).json({
                message:"Invalid user Data"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })
    }
}


const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Please Provide email and Password."
            })
        }
        const user=await Alumni.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"Invalid email ."
            });
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password)
         if(isPasswordMatch){
            res.status(200).json({
                message:'Login Successfully',
                user:{
                    _id:user._id,
                    email:user.email,
                    alumni_token:alumniTokenGenration(user._id),
                    userType:user.userType
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
const getAlumniProfile=async (req,res)=>{
    try{
        const user=await Alumni.findById(req.user.id).select('-password')
        if(user){
            res.json({
                success:true,
                user
            })
        }
    } catch(error){
            res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
    }
}


const addAlumniBasicInfo=async (req,res)=>{
    try {
       const {fullName,phoneNo,location,bio,portfolioLink,linkedInUrl}=req.body;
        if (!fullName || !phoneNo || !location || !bio || !portfolioLink || !linkedInUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }
        console.log(req.body)
        const updatedUser = await Alumni.findByIdAndUpdate(
              req.user.id,
              {
                $push: {
                  basicInfo: { fullName, phoneNo, location, bio, portfolioLink,linkedInUrl }
                }
              },
              { new: true, runValidators: true }
            );
       if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

        res.json({
            success:true,
            message:"Alumni Basic Information is Added Successfully.",
            basicInfo:updatedUser.basicInfo
        })
    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });   
    }
}

const updateAlumniBasicInfo=async (req,res)=>{
    try {
        const user=await Alumni.findById(req.user.id)
        if(!user) return res.status(404).json({message:"User not found."})
        const basicIndex=user.basicInfo.findIndex((info)=> info._id.toString()=== req.params.basicInfoId);
        if(basicIndex==-1){
             return res.status(404).json({ message: "Basic info not found." });
        }

        const {fullName,phoneNo,location,bio,linkedInUrl,portfolioLink}=req.body;
        if (fullName) user.basicInfo[basicIndex].fullName = fullName;
    if (phoneNo) user.basicInfo[basicIndex].phoneNo = phoneNo;
    if (location) user.basicInfo[basicIndex].location = location;
    if (bio) user.basicInfo[basicIndex].bio = bio;
    if(linkedInUrl) user.basicInfo[basicIndex]=linkedInUrl
    if (portfolioLink)
      user.basicInfo[basicIndex].portfolioLink = portfolioLink;

    await user.save();
    res.json({
      success: true,
      message: "Basic info updated successfully.",
      basicInfo: user.basicInfo
    });
    } catch (error) {
         res.status(500).json({
              message: "Server error",
              error: error.message
            });
    }
}


const addLanguage=async(req,res)=>{
    try{
            const {name,proficiency}=req.body;
            if(!name || !proficiency){
                return res.status(400).json({message:"All Fields are required."})
            }
            const updatedUser=await Alumni.findByIdAndUpdate(req.user.id,{
                $push:{
                    languages:{
                        name,proficiency
                    },
                },
            },{
                new:true,runValidators:true
            })
            if(!updatedUser){
                return res.status(404).json({
                    message:"User not found."
                })
            }
            res.json({
                success:true,
                message:"Language is added Successfully.",
                languages:updatedUser.languages
            })
    } catch(error){
            res.status(500).json({
                message:"Server Error.",
                error:error.message
            })
    }
}
const deleteLanguage=async(req,res)=>{
    try {
        const user=await Alumni.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                message:"User not found."
            })
        }
        user.languages=user.languages.filter(lang=>lang._id.toString()!== req.params.langId)
        await user.save();
        res.json({
            success:true,
            message:"Language Information Deleted Successfully.",
            languages:user.languages

        })
    } catch (error) {
                 res.status(500).json({
                message:"Server Error.",
                error:error.message
            })
        
    }
}
const updateLanguage=async(req,res)=>{
    
    
    try {
        const user= await Alumni.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                message:"User not found."
            })
        }
        const langIndex=user.languages.findIndex((language)=>language._id.toString() === req.params.langId)
        if(langIndex ==-1){
            return res.status(404).json({
                message:"Language information Not Found."
            })
        }
        const {name,proficiency}=req.body;
        if(name) user.languages[langIndex].name=name;
        if(proficiency) user.languages[langIndex].proficiency=proficiency


        await user.save()
        res.json({
            success:true,
            message:"Language information updated Successfully.",
            languages:user.languages
        })
    } catch (error) {
             res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
    }
}

const addSkill=async(req,res)=>{
    try{
            const {name,proficiency}=req.body;
            if(!name || !proficiency){
                return res.status(400).json({message:"All Fields are required."})
            }
            const updatedUser=await Alumni.findByIdAndUpdate(req.user.id,{
                $push:{
                    skills:{
                        name,proficiency
                    },
                },
            },{
                new:true,runValidators:true
            })
            if(!updatedUser){
                return res.status(404).json({
                    message:"User not found."
                })
            }
            res.json({
                success:true,
                message:"Language is added Successfully.",
                skills:updatedUser.skills
            })
    } catch(error){
            res.status(500).json({
                message:"Server Error.",
                error:error.message
            })
    }
}
const deleteSkill=async(req,res)=>{
    try {
        const user=await Alumni.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                message:"User not found."
            })
        }
        user.languages=user.skills.filter(skill=>skill._id.toString()!== req.params.skillId)
        await user.save();
        res.json({
            success:true,
            message:"Language Information Deleted Successfully.",
            skills:user.skills

        })
    } catch (error) {
                 res.status(500).json({
                message:"Server Error.",
                error:error.message
            })
        
    }
}
const updateSkill=async(req,res)=>{
    
    
    try {
        const user= await Alumni.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                message:"User not found."
            })
        }
        const skillIndex=user.skills.findIndex((skill)=>skill._id.toString() === req.params.skillId)
        if(langIndex ==-1){
            return res.status(404).json({
                message:"Language information Not Found."
            })
        }
        const {name,proficiency}=req.body;
        if(name) user.skills[langIndex].name=name;
        if(proficiency) user.skills[langIndex].proficiency=proficiency


        await user.save()
        res.json({
            success:true,
            message:"Language information updated Successfully.",
            skills:user.skills
        })
    } catch (error) {
             res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
    }
}






const addAcademics = async (req, res) => {
    try {
       
        
        const user = await Alumni.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        console.log("body",req.body);
        
        const { school, degree, fieldOfStudy, startDate, endDate,grade } = req.body;

        

        user.Academics.unshift({
            school,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
            grade
        });

        await user.save();

        res.json({
            success: true,
            message: 'Education added successfully',
            Academics: user.Academics[0]
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};



const updateAcademics = async (req, res) => {
  console.log("Incoming data:", req.body);
  console.log("User ID:", req.user?.id);
  console.log("Experience ID:", req.params.id);

    
    try {
        const user = await Alumni.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const eduIndex = user.education.findIndex(
            edu => edu._id.toString() === req.params.academicId
        );

        if (eduIndex === -1) {
            return res.status(404).json({ message: 'Education not found' });
        }

        const { school, degree, fieldOfStudy, startDate, endDate,grade } = req.body;

        if (school) user.Academics[eduIndex].school = school;
        if (degree) user.Academics[eduIndex].degree = degree;
        if (fieldOfStudy) user.Academics[eduIndex].fieldOfStudy = fieldOfStudy;
        if (startDate) user.Academics[eduIndex].startDate = startDate;
        if (endDate) user.Academics[eduIndex].endDate = endDate;
        if(grade) user.Academics[eduIndex].startDate=grade;

        await user.save();

        res.json({
            success: true,
            message: 'Education updated successfully',
            Academics: user.Academics
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const deleteAcademics = async (req, res) => {
  try {
    const user = await Alumni.findById(req.user.id); // or req.params.id, depending on auth middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.Academics = user.Academics.filter(
      edu => edu._id.toString() !== req.params.eduId
    );
    console.log("User ID in request param:", req.params.id);
console.log("User ID in token:", req.user.id);
console.log("Education ID to delete:", req.params.eduId);
console.log("Current education IDs:", user.Academics.map(e => e._id.toString()));

    await user.save();

    res.json({
      success: true,
      message: 'Education deleted successfully',
      Academics: user.Academics
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const addAcheivement=async(req,res)=>{
    try{
            const {title,organization,issueDate,certificateUrl,description}=req.body
            console.log(req.body)
            if(!title || !organization || !issueDate || !certificateUrl || !description)
            {
                return res.status(404).json({
                    message:"All Feilds are Required."
                })
            }
            const updatedUser=await Alumni.findByIdAndUpdate(req.user.id,{
                $push:{
                    Acheivements:{
                        title,organization,issueDate,certificateUrl,description
                    },
                },
            },{
                new:true,runValidators:true
            })

            if(!updatedUser) return res.status(404).json({message:"User Not Found."})


            res.json({
                success:true,
                message:"Acheivement Added Successfully.",
                Acheivements:updatedUser.Acheivements
            })
            
    }catch(error){
        res.status(500).json({
            message:"Server Error",
            error
        })
    }
}
const deleteAcheivement=async(req,res)=>{
    try{
        const user=await Alumni.findById(req.user.id)
        if(!user) return res.status(404).json({
            message:"User not found."
        })
        user.Acheivements=user.Acheivements.filter(achievement=>achievement._id.toString() !== req.params.acheivementId);
        await user.save();

        res.json({
            success:true,
            message:"Acheivement Removed Successfully.",
            Acheivements:user.Acheivements
        })
    }catch(error){
         res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
}

const updateAcheivement=async(req,res)=>{
    try{
            const user=await Alumni.findById(req.user.id)
            if(!user) return res.status(404).json({
                message:"User Not Found."
            })
            const achievementIndex=user.Acheivements.findIndex((achievement)=>achievement._id.toString() === req.params.acheivementId)
            if(achievementIndex == -1)  return res.status(404).json({
                message:"Achievement Information not Found."
            })
            const {title,organization,issueDate,certificateUrl,description}=req.body;
            if(title) user.Acheivements[achievementIndex].title=title
            if(organization) user.Acheivements[achievementIndex].organization=organization
            if(issueDate) user.Acheivements[achievementIndex].issueDate=issueDate
            if(certificateUrl) user.Acheivements[achievementIndex].certificateUrl=certificateUrl
            if(description) user.Acheivements[achievementIndex].description=description
            await user.save()
            res.json({
                success:true,
                message:"Achievement is Updated Successfully.",
                Acheivements:user.Acheivements
            })
    }catch(error){
res.status(500).json({
      message: 'Server error',
      error
    });
    }
}

const addAlumniInfo=async(req,res)=>{
    try{
        const {company,position,experience,startDate,additionalInfo}=req.body;
        if(!company || !position || !experience || !startDate || !additionalInfo) return res.status(400).json({message:"All fields are required."})
            const updatedUser=await Alumni.findByIdAndUpdate(req.user.id,{
                $push:{
                    alumniInfo:{
                        company,position,experience,startDate,additionalInfo
                    }
                }
        },{
            new:true,runValidators:true
        })
        if(!updatedUser) return res.status(404).json({
            message:"user not found."
        })
        res.json({
            success:true,
            message:"Alumni Information is added Successfully.",
            alumniInfo:updatedUser.alumniInfo
        })
    } catch(error){
            res.status(500).json({
                message:"server error",
                error
            })
    }
}
const deleteAlumniInfo=async(req,res)=>{
    try {
    const user = await Alumni.findByIdAndUpdate(
      req.user.id,
      { $pull: { alumniInfo: { _id: req.params.alumniId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Alumni Information Deleted Successfully",
      alumniInfo: user.alumniInfo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
}
}
const updateAlumniInfo=async (req,res)=>{
    try{
        const user=await Alumni.findById(req.user.id)
        if(!user) return res.status(404).json({message:"user not found."})
            const alumniIndex=user.alumniInfo.findIndex((alumni)=> alumni._id.toString()===req.params.alumniId)
        if(!alumniIndex) return res.status(404).json({
            message:"Alumni info not found."
        })
        const {company,position,experience,startDate,additionalInfo}=req.body;
        if(company) user.alumniInfo[alumniIndex].company=company
        if(position) user.alumniInfo[alumniIndex].position=position
        if(experience) user.alumniInfo[alumniIndex].experience=experience
        if(startDate) user.alumniInfo[alumniIndex].startDate=startDate
        if(additionalInfo) user.alumniInfo[alumniIndex].additionalInfo=additionalInfo


        res.json({
            success:true,
            message:"alumni information updated Successfully.",
            alumniInfo:user.alumniInfo
        })
    }catch(error){

    }
}
module.exports={
    registerUser,
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
    updateAlumniInfo,
    addSkill,
    updateSkill,
    deleteSkill,
}