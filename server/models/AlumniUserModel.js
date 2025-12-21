const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema(
  {
    // Basic Authentication
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    userType: {
      type: String,
      enum: ["Student", "Alumni"],
      default: "student",
      required: true
    },

    phone: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return !v || /^\d{10}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
     languages: [
      {
        name: { type: String },
        proficiency: { 
          type: String, 
          enum: ["Beginner", "Intermediate", "Advanced","Fluent", "Native"]
        }
      }
    ],
    // Academics
    Academics: [
      {
        school: { type: String, required: true },
        degree: { type: String ,required:true},
        fieldOfStudy: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        grade: { type: String },
        
      }
    ],
    alumniInfo: [
      {company: { type: String, default: "" },
      position: { type: String, default: "" },
      startDate: { type: String, default: "" },
      experience: { type: String, default: "" },
      location:{type: String, default: ""},
      additionalInfo:{type: String, default: ""}
      
      }
    ],
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
    linkedInUrl: {
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
],
    Acheivements:[
      {
        title:{type:String,default:" "},
        organization:{type:String,default:" "},
        issueDate:{type:String,default:" "},
        certificateUrl:{type:String,default:" "},
        description:{type:String,default:" "}
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Alumni', alumniSchema);
