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

exports.uploadProfilePhoto= async (req,res)=>{
    try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
// Construct image URL for serving static files
    const imageUrl = `/uploads/${req.file.filename}`;

    // Here, save imageURL to user profile in DB as needed (pseudo code):
    await User.findByIdAndUpdate(req.user.id, { photo: imageUrl });

    res.status(200).json({ message: 'Upload successful', imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Server error during file upload' });
  }
};

const completeProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic info
        user.fullName = req.body.fullName || user.fullName;
        user.headline = req.body.headline || user.headline;
        user.bio = req.body.bio || user.bio;
        user.location = req.body.location || user.location;
        user.photo = req.body.photo || user.photo;
        user.phone=req.body.phone || user.phone;
        // Update arrays (replace entire arrays)
        if (req.body.education) user.education = req.body.education;
        if (req.body.experience) user.experience = req.body.experience;
        if (req.body.internships) user.internships = req.body.internships;
        if (req.body.projects) user.projects = req.body.projects;
        if (req.body.skills) user.skills = req.body.skills;
        if (req.body.languages) user.languages = req.body.languages;

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: 'Profile completed successfully',
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
//   get education pendging
const getEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the education array
    res.json({
      success: true,
      education: user.education
    });
        } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const addEducation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { school, degree, fieldOfStudy, startDate, endDate } = req.body;

        if (!school) {
            return res.status(400).json({ message: 'School name is required' });
        }

        user.education.unshift({
            school,
            degree,
            fieldOfStudy,
            startDate,
            endDate
        });

        await user.save();

        res.json({
            success: true,
            message: 'Education added successfully',
            data: user.education[0]
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};



const updateEducation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const eduIndex = user.education.findIndex(
            edu => edu._id.toString() === req.params.id
        );

        if (eduIndex === -1) {
            return res.status(404).json({ message: 'Education not found' });
        }

        const { school, degree, fieldOfStudy, startDate, endDate } = req.body;

        if (school) user.education[eduIndex].school = school;
        if (degree) user.education[eduIndex].degree = degree;
        if (fieldOfStudy) user.education[eduIndex].fieldOfStudy = fieldOfStudy;
        if (startDate) user.education[eduIndex].startDate = startDate;
        if (endDate) user.education[eduIndex].endDate = endDate;

        await user.save();

        res.json({
            success: true,
            message: 'Education updated successfully',
            education: user.education
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const deleteEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // or req.params.id, depending on auth middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.education = user.education.filter(
      edu => edu._id.toString() !== req.params.eduId
    );
    console.log("User ID in request param:", req.params.id);
console.log("User ID in token:", req.user.id);
console.log("Education ID to delete:", req.params.eduId);
console.log("Current education IDs:", user.education.map(e => e._id.toString()));

    await user.save();

    res.json({
      success: true,
      message: 'Education deleted successfully',
      education: user.education
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


const addExperience = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { company, title, employmentType, location, startDate, endDate, currentlyWorking, description } = req.body;

        if (!company || !title) {
            return res.status(400).json({ message: 'Company and title are required' });
        }

        user.experience.unshift({
            company,
            title,
            employmentType,
            location,
            startDate,
            endDate,
            currentlyWorking,
            description
        });

        await user.save();

        res.json({
            success: true,
            message: 'Experience added successfully',
            experience: user.experience
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const updateExperience = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expIndex = user.experience.findIndex(
            exp => exp._id.toString() === req.params.id
        );

        if (expIndex === -1) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        const { company, title, employmentType, location, startDate, endDate, currentlyWorking, description } = req.body;

        if (company) user.experience[expIndex].company = company;
        if (title) user.experience[expIndex].title = title;
        if (employmentType) user.experience[expIndex].employmentType = employmentType;
        if (location) user.experience[expIndex].location = location;
        if (startDate) user.experience[expIndex].startDate = startDate;
        if (endDate) user.experience[expIndex].endDate = endDate;
        if (currentlyWorking !== undefined) user.experience[expIndex].currentlyWorking = currentlyWorking;
        if (description) user.experience[expIndex].description = description;

        await user.save();

        res.json({
            success: true,
            message: 'Experience updated successfully',
            experience: user.experience
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const deleteExperience = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.experience = user.experience.filter(
            exp => exp._id.toString() !== req.params.id
        );

        await user.save();

        res.json({
            success: true,
            message: 'Experience deleted successfully',
            experience: user.experience
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

const addSkill = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, level } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Skill name is required' });
        }

        user.skills.push({ name, level });
        await user.save();

        res.json({
            success: true,
            message: 'Skill added successfully',
            skills: user.skills
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.skills = user.skills.filter(
            skill => skill._id.toString() !== req.params.id
        );

        await user.save();

        res.json({
            success: true,
            message: 'Skill deleted successfully',
            skills: user.skills
        });

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
    completeProfile,
    getEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    deleteSkill
};
