const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Basic Authentication
    email: {
      type: String,
      required:false,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
   phone: {
  type: String,
  required: false,  // or set to true only if you always ensure value exists
  validate: {
    validator: function(v) {
      return !v || /^\d{10}$/.test(v);  // allow empty or valid phone format
    },
    message: 'Please fill a valid phone number'
  }
},

    // Profile Information
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    headline: {
      type: String,
      default: "",
      trim: true
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500
    },
    location: {
      type: String,
      default: "",
      trim: true
    },
    profilePic: {
      type: String, // URL to profile photo
      default: null
    },

    // Languages
    languages: [
      {
        name: { type: String },
        proficiency: { 
          type: String, 
          enum: ["Beginner", "Intermediate", "Advanced","Fluent", "Native"]
        }
      }
    ],

    // Education
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String ,required:true},
        fieldOfStudy: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        grade: { type: String },
        
      }
    ],

    // Experience
    experience: [
      {
        company: { type: String, required: true },
        title: { type: String, required: true },
        employmentType: { 
          type: String, 
          enum: ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship"]  //Used for fields with specific allowed values (like employment type, proficiency level)
        },
        location: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String }
      }
    ],

    // Internships
    internships: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String }
      }
    ],

    // Projects
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        technologies: [{ type: String }],
        link: { type: String },
        startDate: { type: String },
        endDate: { type: String }
      }
    ],

    // Skills
    skills: [
      {
        name: { type: String, required: true },
        level: { 
          type: String, 
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
        }
      }
    ],

    // Current Position
    current: [
      {company: { type: String, default: "" },
      role: { type: String, default: "" },
      startDate: { type: String, default: "" },
      employmentType: { 
        type: String, 
        enum: ["Full-time","Part-time","Internship","Freelance"],
        default: "Full-time"
      },
      location:{type: String, default: ""},
      description:{type: String, default: ""
      }
      }
    ],

    // Contact Information
    contact: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      portfolio: { type: String, default: "" } // Could be LinkedIn, portfolio, etc.
    },
    basicInfo: [
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
   
    phoneNo: {
      type: String,
      default: "",
      trim: true
    },
    location: {
      type: String,
      default: "",
      trim: true
    },
    portfolioLink: {
      type: String,
      default: "",
      trim: true
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500
    }
  }
]

  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
