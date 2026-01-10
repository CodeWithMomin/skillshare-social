import React, { useState ,useEffect} from "react";
import "../pages/CompleteProfile.css";
import EditIcon from '@mui/icons-material/Edit';
import toast from "react-hot-toast";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAuth } from "../context/AuthContext";
import { useEdu } from "../context/EducationContext";
import { useNavigate } from "react-router-dom";
import { useExp } from "../context/ExpContext";
import { useInternship } from "../context/InternshipContext";
import { useLang } from "../context/LangContext";
import { getBottomNavigationUtilityClass } from "@mui/material/BottomNavigation";
import { useSkills } from "../context/SkillsContext";
import { useBasicInfo } from "../context/BasicInfoContext";
import { useCurrentPosition } from "../context/CurrentPosContext";
const CompleteProfile = () => {
const [userData,
  setUserData]=useState([])


 const {user,getUserProfile}=useAuth();
 const navigate=useNavigate()
  const {addEducation,updateEducation,deleteEducation}=useEdu()
  const {addExperience,updateExperience,deleteExperience
  }=useExp()
  const {addInternships,deleteInternships,updateInternships}=useInternship()
  const {addLanguage,
            deleteLanguage,
            updatedLanguage}=useLang()
  const {addSkill,deleteSkill,updateSkill}=useSkills();
  const {addBasicInfo,updateBasicInfo}=useBasicInfo()
  const { addCurrentPosition,
            deleteCurrentPosition,
            updateCurrentPosition}=useCurrentPosition()
  const sections = [
    { id: "basic", name: "Basic Info" },
    { id: "language", name: "Language" },
    { id: "education", name: "Education" },
    { id: "internships", name: "Internships" },
    { id: "experience", name: "Experience" },
    { id: "skills", name: "Skills" },
    { id: "current", name: "Current Position" },
   
  ];
 
  const [activeSection, setActiveSection] = useState("basic");
  // Skills state

  // --- Skill Management States ---
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState({ name: "", level: "Beginner" });

  // For editing existing skills
  const [editSkillIndex, setEditSkillIndex] = useState(null);
 const [editSkillId,setEditSkillId]=useState(getBottomNavigationUtilityClass)

  // --- Handlers ---

  // Add a new skill
  const handleAddSkill = async() => {
    if (!skillInput.name.trim()) return;
    // console.log(skillInput);
    try {
      const {success,data,error}=await addSkill(skillInput)
      if(success){
        setSkills(data)
        toast.success("Skill added Successfully.")
      }
      else{
          console.log("API failed");
      toast.error(error);
      }
    } catch (error) {
      console.error("Error adding internship:", error);
    toast.error("Something went wrong. Please try again.")
    }
  };

  // Remove a skill
  const handleRemoveSkill = async (skillId) => {
   console.log("i am clicked",skillId);
   try{
    if(!skillId){
      console.error('Missing SkillID for Skill removal')
    }
    const {success,data,error}=await deleteSkill(skillId);
    if(success){
      setSkills(data)
      toast.success("Skill removed Successfully.")
    }
    else{
       toast.error("Failed to Remove")
      console.error(error.message)
    }
   }
   catch(error){
console.error("Error removing skill:", err);
      toast.error("API error. Check console.");
   }
   
  };

  // Start editing a skill
  const handleEditSkill = (index,skillId) => {
    const selectedSkill=skills[index]
    setSkillInput({
      name:selectedSkill.name,
      level:selectedSkill.level
    })
    setEditSkillIndex(index)
    setEditSkillId(skillId)
   
  };

  // Save an edited skill
  const handleSaveSkillChanges = async() => {
    if(editSkillIndex ==null) return;
    try {
      const {success,data,error}=await updateSkill(editSkillId,skillInput)
      if(success){
        setSkills(data)
        toast.success('Skill Updated Successfully.')
        setEditSkillIndex(null)
        setEditSkillId(null)
        setSkillInput({
          name:"",
          level:"Beginner"
        })
      }
      else{
          console.error("Update failed:", error);
      toast.error(error || "Update failed.");
      }
    } catch (error) {
       console.error("Error updating skill:", error);
    toast.error("API error. Check console.");
    }
  };

  // Cancel editing
  

  // --- Experience States ---
  const [experiences, setExperiences] = useState([]);
  const [experienceEditingIndex,setExperienceEditingIndex]=useState(null)
  const [experienceId,setExperienceId]=useState(null)
  const [experienceInput, setExperienceInput] = useState({
  company: "",
  title: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
  });

  // --- Handlers ---

  // Add new experience
 const handleAddExperience = async () => {
  try {
    const {success,error,data}=await addExperience(experienceInput)
    if(success){

setExperiences(data)



  toast.success("Added Successfully.")
        setExperienceInput({
           company: "",
  title: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  // currentlyWorking: false,
  description: "",
        })
    }
    else {
      console.log("API failed")
      toast.error("API failed")
    }
    
  } catch (error) {
    console.log(error.message);
    
  }
 }



  // Remove experience
  const handleRemoveExperience = async(index,expId)=> {
      try {
        const {success,error,data}=await deleteExperience(expId)
        if(success){
          setExperiences(data)
          toast.success("Removed Successfully.")
        }
        else{
          toast.error("Failed to Remove")
        }
      } catch (error) {
        console.log(error);
        
      }
      }
     
const handleSaveExperienceChanges= async ()=>{
  if(experienceEditingIndex ==null) return ;
    // console.log(experienceId,experienceInput);
    
 try {
   const userId = userData?._id; // or however your logged-in user is stored

    const { success, error, data } = await updateExperience(
          
      experienceId,       // ✅ experience ID
      experienceInput     // ✅ updated data
    );

  if(success){
    setExperiences(data)
    toast.success("Updated SuccessFully.")
  }
  else{
    toast.error("Update Failed",error.message)
    console.log(error);
    
  }
  
 } catch (error) {
  console.log(error);
  
 }
  // const updateExperience=[...experiences]
  // updateExperience[experienceEditingIndex]=experienceInput;
  // setExperiences(updateExperience)
  setExperienceEditingIndex(null)
  setExperienceInput({
    company: "",
  title: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",

  description: "",
  })
}

const handleEditExperience=async (index,expId)=>{
  
const selectedExperience=experiences[index]
setExperienceInput({
   company:selectedExperience.company,
  title:selectedExperience.title,
  employmentType:selectedExperience.employmentType,
  location:selectedExperience.location,
  startDate:selectedExperience.startDate,
  endDate:selectedExperience.endDate,
 
  description:selectedExperience.description,
});
setExperienceEditingIndex(index)
setExperienceId(expId)
}
  

  // --- Education States ---
  const [education, setEducation] = useState([]);
  const [educationInput, setEducationInput] = useState({
    school: "",
    degree: "",
    fieldOfStudy:"",
    startDate:"",
    endDate:"",
    details: "",
  });
  const [educationEditingIndex, setEducationEditingIndex] = useState(null);
  const [educationId,setEducationId]=useState(null)

  // --- Handlers ---

  // Add education entry
  const handleAddEducation = async () => {
  if (!educationInput.school.trim() || !educationInput.degree.trim()) return;
  const userId = userData?._id;

 setEducation(prev => (Array.isArray(prev) ? [...prev, educationInput] : [educationInput]));

  setEducationInput({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    details: "",
  });

  try {
    const { success, error, data } = await addEducation( educationInput); // send only the single object
    if (success) {
      // console.log("Education saved successfully:", data);
      setUserData(prev => ({ ...prev, education: [...prev.education, data] })); // append new returned data
      toast.success("Education Added Successfully.", {
        duration: 1000,
        position: "top-center",
      });
    } else {
      toast.error("API failed.");
    }
  } catch (error) {
    console.error("Save Education API error:", error);
    toast("API error:", error);
  }
};

  const handleEditEducation=(index,eduId)=>{
    // alert(index)
    const selectedEducation=education[index]
    //  console.log("Selected Education",selectedEducation);
    // console.log(eduId);
    
    setEducationInput({
    school: selectedEducation.school,
    degree: selectedEducation.degree,
    fieldOfStudy: selectedEducation.fieldOfStudy,
    startDate: selectedEducation.startDate,
    endDate: selectedEducation.endDate,
    details: selectedEducation.details,
  });
  setEducationEditingIndex(index)
  setEducationId(eduId)
    
  }
const handleSaveEducationChanges= async ()=>{
  if(educationEditingIndex==null) return;
  // console.log(educationId,"ID");
  // console.log(educationInput);
  
  try{
      const {success,error,data}=await updateEducation(educationId,educationInput);
     if (success) {
      console.log("Updated education array:", data);

      // ✅ Immediately update the frontend UI
      setEducation(data);
       toast.success("Updated SuccessFully.")
     }
      else{
        toast.error("Update Failed.")
        console.log(error.message);
        
      }
  }
  catch (error){
console.log(error);

      }
      setEducationEditingIndex(null)
  setEducationInput({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    details: "",
  });
 }


  // Remove education entry
  const handleRemoveEducation = async (index, eduId) => {
  const userId = userData?._id;

  if (userId && eduId != null) {
    try {
      const { success, error } = await deleteEducation(eduId);
      if (success) {
        toast.success("Education Removed Successfully.", {
          duration: 1000,
          position: "top-center",
        });

        // ✅ Remove from both education and userData.education safely
        setEducation(prev => prev.filter((_, i) => i !== index));
        setUserData(prev => ({
          ...prev,
          education: prev.education.filter((_, i) => i !== index),
        }));
      } else {
        toast.error(error || "Failed to remove education.");
      }
    } catch (error) {
      console.error("Remove Education API error:", error);
      toast.error("API error while removing education.");
    }
  } else {
    console.error("Missing user ID or education ID");
  }
};


  // --- Internship States ---
  const [internships, setInternships] = useState([]);
  const [internshipInput, setInternshipInput] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description:""
  });
  const [internshipEditingIndex,setInternshipEdtingIndex]=useState(null)
  const [internshipid,setInternshipId]=useState(null)

  // --- Handlers ---

  // Add internship
 const handleAddInternship = async () => {
  if (!internshipInput.company.trim() || !internshipInput.role.trim()) return;

  console.log("Adding internship:", internshipInput);

  try {
    const { success, data, error } = await addInternships(internshipInput);

    if (success && data) {
      setInternships(data);
      toast.success("Internship Information added successfully.");
      // Clear the input fields
      setInternshipInput({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    } else {
      console.log("API failed");
      toast.error(error);
    }
  } catch (error) {
    console.error("Error adding internship:", error);
    toast.error("Something went wrong. Please try again.");
  }
};


  // Remove internship
  const handleRemoveInternship =async(internshipId) => {
    try {
      if(!internshipId){
      console.error("Missing internshipId for Removal ")
    }
    const {success,error,data}=await deleteInternships(internshipId);
    if(success){
      setInternships(data)
      toast.success("Internship Removed Successfully.")
    }
    else{
      toast.error("Failed to Remove")
      console.error(error)
    }
    } catch (error) {
       console.error("Error removing internship:", err);
      toast.error("API error. Check console.");
    }

  };

  const handleEditInternship= async(index,internshipId)=>{
      const selectedInternship=internships[index]
      // console.log("selected internship",selectedInternship);
      setInternshipInput({
         company:selectedInternship.company,
        role:selectedInternship.role,
        startDate:selectedInternship.startDate,
        endDate:selectedInternship.endDate,
        description:selectedInternship.description,
      })
      setInternshipEdtingIndex(index);
      setInternshipId(internshipId)
      
  }

  const handleSaveInternshipChanges=async()=>{
    if(internshipEditingIndex == null) return;
    console.log(internshipid,internshipInput);
     try {
      const {success,data,error}=await updateInternships(internshipid,internshipInput);
      if(success){
        setInternships(data)
        toast.success("Internship Updated Successfully.")
        setInternshipEdtingIndex(null); // keep existing setter name
      setInternshipId(null);
      setInternshipInput({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: ""
      });
      } else {
      console.error("Update failed:", error);
      toast.error(error || "Update failed.");
    }
      
     } catch (error) {
        console.error("Error updating internship:", err);
    toast.error("API error. Check console.");
     }
    
  }
  // --- Language States ---
  const [languages, setLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState([]);

  // Edit states
  const [editLangIndex, setEditLangIndex] = useState(null);
  const [editLangId,setEditLangId]=useState(null)
 

  // Add a language
  const handleAddLanguage = async() => {
    // console.log("i am clicked ",languages);
    
    if (!languageInput.name.trim()) return;
    // console.log(languageInput);
    try {
      const {success,data,error}=await addLanguage(languageInput)
      if(success){
        setLanguages(data) 
        toast.success("Language added Successfully.")
        setLanguageInput(
          { name: "", proficiency: "Beginner",});
      }  else {
      console.log("API failed");
      toast.error(error);
      }
    } catch (error) {
      console.error("Error adding internship:", error);
    toast.error("Something went wrong. Please try again.");
    }
    
    // setLanguages([...languages, languageInput]);
    
  };

  // Remove a language
  const handleRemoveLanguage = async(langId) => {
     try{
        if(!langId){
          console.error("Missing Language ID for Removal.")
        }
         const { success, data, error } = await deleteLanguage(langId);
        if(success)
        {
          setLanguages(data)
          toast.success('Language Removed.')

        }else{
          toast.error("Failed to Remove")
      console.error(error.message)
        }
   } catch(error){
console.error("Error removing Language:", err);
      toast.error("API error. Check console.");
   }
  };

  // Edit language
  const handleEditLanguage = (index,langId) => {
    const selectedLanguage=languages[index]
    setLanguageInput({
      name:selectedLanguage.name,
      proficiency:selectedLanguage.proficiency

    })
     setEditLangIndex(index);
     setEditLangId(langId)
   
  };

  // Save edited language
  const handleSaveLanguageChanges = async() => {
   if(editLangIndex== null) return
     console.log(editLangId,languageInput);
    try {
      const {success,data,error}=await updatedLanguage(editLangId,languageInput)
      if(success){
        setLanguages(data);
        toast.success('Language information Updates Successfully.')
        setEditLangIndex(null)
        // setEditLangId(null)
        setLanguageInput({
           name: "",
    proficiency: "Beginner",
        })
      }
      else{
          console.error("Update failed:", error);
      toast.error(error || "Update failed.");
      }
    } catch (error) {
     console.error("Error updating internship:", error);
    toast.error("API error. Check console.");
    }
    
  // setEditLangId(null)
  }

const[basicInformation,setBasicInformation]=useState([])
const [basicInfo, setBasicInfo] = useState({
  fullName: "",
  phoneNo: "",
  location: "",
  bio: "",
  portfolioLink:""
});

 const [basicinfoIndex,setBasicInfoIndex]=useState(null)
 const [basicInfoId,setBasicInfoId]=useState()
 


  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };
const handleBasicInfoSave=async()=>{
// console.log(basicInfo);

try{
  const {success,data,error}=await addBasicInfo(basicInfo)
  if(success){
    setBasicInformation(data)
    toast.success("Added Successfully.")
    setBasicInfo({
  fullName: "",
  phoneNo: "",
  location: "",
  bio: "",
  portfolioLink:""
    })
  }
  else{
toast.error("Failed to add.")
console.error(error)
  }
}catch(error){
console.error("Error adding Basic Info:", error);
    toast.error("Something went wrong. Please try again.");
}


}
const handleSaveBasicChanges= async ()=>{
  // console.log(basicInfoId);

  
  if(basicinfoIndex==null) return;
  try {
    const {success,data,error}=await updateBasicInfo(basicInfoId,basicInfo)
    if(success){
      setBasicInformation(data)
      toast.success("Updated Successfully.")
      setBasicInfoIndex(null)
      setBasicInfo({
        fullName: "",
  phoneNo: "",
  location: "",
  bio: "",
  portfolioLink:""
      })
    }else{
toast.error("Failed to Update.")
console.error(error)
  }

  } catch (error) {
    console.error("Error Updating Basic Info:", error);
    toast.error("Something went wrong. Please try again.");
}
  }

const handleEditBasicChange=(index,infoId)=>{

    const selectedInfo=basicInformation[index]
setBasicInfo({
  fullName:selectedInfo.fullName,
  phoneNo:selectedInfo.phoneNo,
  location:selectedInfo.location,
  bio:selectedInfo.bio,
  portfolioLink:selectedInfo.portfolioLink
    })
  
  setBasicInfoIndex(index)
  setBasicInfoId(infoId)
}
 

const [currentPositions,setCurrentPositions]=useState([])
const [currentPositionInputs,setCurrentPositionInputs]=useState({
  company:"",
  role:"",
  startDate:"",
  employmentType:"Full-time",
  location:"",
  description:""
})
const [currentPositionId,setCurrentPositionId]=useState(null)
const [currentPositionEditingIndex,setCurrentPositionEditingIndex]=useState(null)

const handleAddCurrentPosition=async()=>{
  if(!currentPositionInputs) return;
  console.log(currentPositionInputs);
  
  try {
    const {success,data,error}=await addCurrentPosition(currentPositionInputs);
    if(success){
      setCurrentPositions(data)
      toast.success("Position added.")
      setCurrentPositionInputs({
        company:"",
        role:"",
        startDate:"",
        employmentType:"Full-time",
        location:"",
        description:""
      })
    }
    else{
      console.log("API failed");
      toast.error(error.message);
    }

  } catch (error) {
     console.error("Error adding internship:", error);
    toast.error("Something went wrong. Please try again.");
  }

}


const handleSaveCurrentPositionChanges=async()=>{
// console.log(currentPositionId,currentPositionInputs);
if(currentPositionEditingIndex == null) return;
try {
  const {success,data,error}=await updateCurrentPosition(currentPositionId,currentPositionInputs)
  if(success){
    setCurrentPositions(data)
    toast.success('Updated Successfully.')
    setCurrentPositionEditingIndex(null)
    setCurrentPositionId(null)
    setCurrentPositionInputs({
        company:"",
        role:"",
        startDate:"",
        employmentType:"Full-time",
        location:"",
        description:""
      })
    }else{
      console.error("Update failed:", error);
      toast.error(error || "Update failed.");
    }
  
} catch (error) {
  console.error("Error updating internship:", err);
    toast.error("API error. Check console.");
}

}
const handleEditCurrentPosition=async(index,posId)=>{
  const selectedCurrentPosition=currentPositions[index]
  setCurrentPositionInputs({
     company:selectedCurrentPosition.company,
  role:selectedCurrentPosition.role,
  startDate:selectedCurrentPosition.startDate,
  employmentType:selectedCurrentPosition.employmentType,
  location:selectedCurrentPosition.location,
  description:selectedCurrentPosition.description,
  })
  setCurrentPositionEditingIndex(index)
  setCurrentPositionId(posId)

}
const handleRemoveCurrentPosition=async(index,posId)=>{
  console.log(posId);
  
  try {
    if(!posId)
      {
         console.error("Missing PosId for Removal ")
      } 
      const {success,data,error}=await deleteCurrentPosition(posId)
      if(success){
        setCurrentPositions(data)
        toast.success("Removed Successfully.")
      }else{
      toast.error("Failed to Remove")
      console.error(error)
    }
  } catch (error) {
    console.error("Error removing Current Position:", error);
      toast.error("API error. Check console.");
  }
}




useEffect(() => {
      const fetchUserProfile = async () => {
        
        
        try {
        const data = await getUserProfile(); // data is already JSON here
        
        // console.log("Profile Data",data);
        
        setUserData(data);
        console.log();
        
        setBasicInfo({
            fullName: data.fullName || "",
            email: data.email || "",
            phoneNo: data.phone || "",
            location: data.location || "",
            bio: data.bio || "",
          });
        setExperienceInput({
          company:data.experience.company || " ",
          title:data.experience.title || "",
          employmentType:data.experience.employmentType || "",
          location:data.experience.location || "",
          startDate:data.experience.startDate || "",
          endDate:data.experience.endDate || "",
          description:data.experience.description || ""
        })
    //     setEducation({
    //       school: data.education.school,
    // degree: data.education.degree,
    // fieldOfStudy:data.education.fieldOfStudy,
    // startDate:data.education.startDate,
    // endDate: data.education.endDate,
    // details: data.education.details
    //     })
    setEducation(data.education)
        setExperiences(data.experience)
        setInternships(data.internships)
        setLanguages(data.languages)
        setSkills(data.skills)
        setCurrentPositions(data.current)
        setBasicInformation(data.basicInfo)
      } catch (error) {
        console.error(error.message);
         toast("error:", error);
      } 
      };
   fetchUserProfile();
      
    }, []);

  return (
    <div className="profile-wrapper">
      
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Profile Sections</h2>
        <ul className="sidebar-list">
          {sections.map(sec => (
            <li
              key={sec.id}
              className={`sidebar-item ${
                activeSection === sec.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(sec.id)}
            >
              {sec.name}
            </li>
          ))}
        </ul>
        <ul>
          <button  className="save-btn" onClick={(e)=>{
              e.preventDefault();
              navigate("/profile")
          }} >
            Go Back
            </button>
        </ul>
      </aside>

      {/* ===== Form Area ===== */}
      <div className="form-area">
        <h2 className="form-title">
          {sections.find(s => s.id === activeSection)?.name || ""}
        </h2>

        <form className="profile-form">
          {/* === BASIC INFO === */}
          {activeSection === "basic" && (
            <>
    <div className="form-grid">

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={basicInfo.fullName}
          onChange={handleBasicChange}
        />
      </div>

    
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNo"
          placeholder="Enter your phone number"
          value={basicInfo.phoneNo}
          onChange={handleBasicChange}
        />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          placeholder="City, Country"
          value={basicInfo.location}
          onChange={handleBasicChange}
        />
      </div>

      <div className="form-group">
        <label>Portfolio Link</label>
        <input
          type="text"
          name="portfolioLink"
          placeholder="Your portfolio website"
          value={basicInfo.portfolioLink}
          onChange={handleBasicChange}
        />
      </div>

    </div>

    <div className="form-group">
      <label>Bio</label>
      <textarea
        name="bio"
        placeholder="Write a short bio..."
        value={basicInfo.bio}
        onChange={handleBasicChange}
      ></textarea>
    </div>

    <div className="form-actions">
      {basicinfoIndex !== null ? (
                  <button className="add-skill-btn" onClick={handleSaveBasicChanges} type="button">
                    Save Changes
                  </button>
                ):(<button
                  className="add-skill-btn"
                  onClick={handleBasicInfoSave}
                  type="button"
                >
                  Submit Basic INFO
                </button>)}
    </div>

    {basicInformation.length > 0 && (
                <div className="skills-list">
                  {basicInformation.map((info, index) => (
                    <div key={index} className="skill-item">
                    <p>Name:<span>{info.fullName}</span> </p>
                    <p>No:<span>{info.phoneNo}</span></p>
                        
                      
                      <button
                        className="remove-skill"
                        onClick={() => handleEditBasicChange(index,info._id)}
                        type="button"
                      >
                        <EditIcon sx={{
                          color:"#0077B5"
                        }}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
  </>
          )}

          {/* === LANGUAGE SECTION === */}
          {activeSection === "language" && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label>Language</label>
                  <input
                    type="text"
                    placeholder="e.g. English, Hindi, Spanish"
                    value={languageInput.name}
                    onChange={e =>
                      setLanguageInput({
                        ...languageInput,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Proficiency</label>
                  <select
                    value={languageInput.proficiency}
                    onChange={e =>
                      setLanguageInput({
                        ...languageInput,
                        proficiency: e.target.value,
                      })
                    }
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Fluent</option>
                    <option>Native</option>
                  </select>
                </div>
              </div>

              <div
                className="form-actions"
                style={{ justifyContent: "flex-start" }}
              >
                {editLangIndex !== null ? (
                  <button className="add-skill-btn" onClick={handleSaveLanguageChanges} type="button">
                    Save Changes
                  </button>
                ):(<button
                  className="add-skill-btn"
                  onClick={handleAddLanguage}
                  type="button"
                >
                  + Add Language
                </button>)}
              </div>

              {languages.length > 0 && (
                 <div className="skills-list">
                  {languages.map((lang, index) => (
                    <div key={index} className="skill-item">
                      <div>
                        <strong>{lang.name}</strong>
                        <span>{lang.proficiency}</span>
                       
                      
                      </div>
                      
                      <button
          className="remove-skill"
          onClick={() => handleRemoveLanguage(lang._id)}
          type="button"
        >
          <DeleteOutlineIcon sx={{ color:"#0077B5" }}/>
        </button>
        <button
          className="remove-skill"
          onClick={() => handleEditLanguage(index,lang._id)}
          type="button"
        >
          <EditIcon sx={{ color:"#ee" }}/>
        </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* === EDUCATION === */}
          {activeSection === "education" && (
          <>
              <div className="form-grid">
                <div className="form-group">
                  <label>Institution Name</label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Delhi, Harvard University"
                    value={educationInput.school}
                    onChange={e =>
                      setEducationInput({
                        ...educationInput,
                        school: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Degree </label>
                  <input
                    type="text"
                    placeholder="B.Tech/M.Tech"
                    value={educationInput.degree}
                    onChange={e =>
                      setEducationInput({
                        ...educationInput,
                        degree: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Field Of Study </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech in Computer Science"
                    value={educationInput.fieldOfStudy}
                    onChange={e =>
                      setEducationInput({
                        ...educationInput,
                        fieldOfStudy: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="Date"
                    placeholder="e.g. 2020 "
                    value={educationInput.startDate}
                    onChange={e =>
                      setEducationInput({
                        ...educationInput,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="Date"
                    placeholder="e.g. 2024 "
                    value={educationInput.endDate}
                    onChange={e =>
                      setEducationInput({
                        ...educationInput,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div
                  className="form-group"
                  style={{ gridColumn: "1 / span 2" }}
                >
                  <label>Additional Details</label>
                  <textarea
                    placeholder="Achievements, GPA, Major projects, etc."
                    rows="3"
                    value={educationInput.details}
                    onChange={e =>
                      setEducationInput({
                        ...educationInput,
                        details: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>

              <div
                className="form-actions"
                style={{ justifyContent: "flex-start" }}
              >
                {/* */}

                {educationEditingIndex !== null ? (
                 <button
                  className="add-skill-btn"
                  onClick={handleSaveEducationChanges}
                  type="button"
                >
                  Save Changes
                </button> 
                 ) : (
              <button
                  className="add-skill-btn"
                  onClick={handleAddEducation}
                  type="button"
                >
                  + Add Education
                </button> 
                )}
              </div>

              {education.length > 0 && (
                <div className="skills-list">
                  {education.map((edu, index) => (
                    <div key={index} className="skill-item">
                      <div>
                        <strong>{edu.degree}</strong> —{" "}
                        <span>{edu.school}</span>
                        <br />
                        <small>{edu.year}</small>
                        <p style={{ marginTop: "5px", color: "#555" }}>
                          {edu.details}
                        </p>
                      </div>
                      <button
                        className="remove-skill"
                        onClick={() => handleRemoveEducation(index,edu._id)}
                        type="button"
                      >
                        <DeleteOutlineIcon sx={{
                          color:"#0077B5"
                        }}/>
                      </button>
                      <button
                        className="remove-skill"
                        onClick={() => handleEditEducation(index,edu._id)}
                        type="button"
                      >
                        <EditIcon sx={{
                          color:"#0077B5"
                        }}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* === INTERNSHIPS === */}
          {activeSection === "internships" && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label>Company/ Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Microsoft, Deloitte"
                    value={internshipInput.company}
                    onChange={e =>
                      setInternshipInput({
                        ...internshipInput,
                        company: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Role / Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Analyst Intern"
                    value={internshipInput.role}
                    onChange={e =>
                      setInternshipInput({
                        ...internshipInput,
                        role: e.target.value,
                      })
                    }
                  />
                </div>

                 <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="Date"
                    placeholder="e.g. 2020 "
                    value={internshipInput.startDate}
                    onChange={e =>
                      setInternshipInput({
                        ...internshipInput,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="Date"
                    placeholder="e.g. 2024 "
                   value={internshipInput.endDate}
                    onChange={e =>
                      setInternshipInput({
                        ...internshipInput,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div
                  className="form-group"
                  style={{ gridColumn: "1 / span 2" }}
                >
                  <label>Description</label>
                  <textarea
                    placeholder="Describe your work, achievements or projects..."
                    rows="3"
                    value={internshipInput.description}
                    onChange={e =>
                      setInternshipInput({
                        ...internshipInput,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>

              <div
                className="form-actions"
                style={{ justifyContent: "flex-start" }}
              >
                {internshipEditingIndex !== null ? (
                  <button className="add-skill-btn" onClick={handleSaveInternshipChanges} type="button">
                    Save Changes
                  </button>
                ):(<button
                  className="add-skill-btn"
                  onClick={handleAddInternship}
                  type="button"
                >
                  + Add Internship
                </button>)}
              </div>

              {internships.length > 0 && (
                <div className="skills-list">
                  {internships.map((intern, index) => (
                    <div key={index} className="skill-item">
                      <div>
                        <strong>{intern.role}</strong> at {intern.company}
                        <span>{intern.organization}</span>
                        <br />
                        <small>{intern.startDate} - {intern.endDate}</small> 
                        <p style={{ marginTop: "5px", color: "#101010ff" }}>
                          {intern.description}
                        </p>
                      </div>
                      
                      <button
          className="remove-skill"
          onClick={() => handleRemoveInternship(intern._id)}
          type="button"
        >
          <DeleteOutlineIcon sx={{ color:"#0077B5" }}/>
        </button>
        <button
          className="remove-skill"
          onClick={() => handleEditInternship(index,intern._id)}
          type="button"
        >
          <EditIcon sx={{ color:"#ee" }}/>
        </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* === EXPERIENCE === */}
          {activeSection === "experience" && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Infosys"
                    value={experienceInput.company}
                    onChange={e =>
                      setExperienceInput({
                        ...experienceInput,
                        company: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Role / Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={experienceInput.title}
                    onChange={e =>
                      setExperienceInput({
                        ...experienceInput,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                    {/* Employment Type */}
  <div className="form-group">
    <label>Employment Type</label>
    <select
      value={experienceInput.employmentType}
      onChange={e =>
        setExperienceInput({
          ...experienceInput,
          employmentType: e.target.value,
        })
      }
    >
      <option value="">Select type</option>
      <option value="Full-time">Full-time</option>
      <option value="Part-time">Part-time</option>
      <option value="Self-employed">Self-employed</option>
      <option value="Freelance">Freelance</option>
      <option value="Contract">Contract</option>
      <option value="Internship">Internship</option>
    </select>
  </div>

 {/* Location */}
  <div className="form-group">
    <label>Location</label>
    <input
      type="text"
      placeholder="e.g. New York, USA"
      value={experienceInput.location}
      onChange={e =>
        setExperienceInput({ ...experienceInput, 
          location: e.target.value })
      }
    />
  </div>
         {/* Start Date */}
  <div className="form-group">
    <label>Start Date</label>
    <input
      type="date"
      value={experienceInput.startDate}
      onChange={e =>
        setExperienceInput({ ...experienceInput, startDate: e.target.value })
      }
    />
  </div>
                
  {/* End Date */}
  <div className="form-group">
    <label>End Date</label>
    <input
      type="date"
      value={experienceInput.endDate}
     
      onChange={e =>
        setExperienceInput({ ...experienceInput, endDate: e.target.value })
      }
      disabled={ experienceInput.employmentType === "Part-Time"}
    />
  </div>
  
                <div className="form-group"
                  style={{ gridColumn: "1 / span 2" }}
                >
                  <label>Description</label>
                  <textarea
                    placeholder="Briefly describe your work or projects..."
                    rows="3"
                    value={experienceInput.description}
                    onChange={e =>
                      setExperienceInput({
                        ...experienceInput,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
                    
              <div
                className="form-actions"
                style={{ justifyContent: "flex-start" }}
              >


                      {experienceEditingIndex !==null?(
                        <button
                  className="add-skill-btn"
                  onClick={handleSaveExperienceChanges}
                  type="button"
                >
                  Save Changes
                </button>
                      ):(<button
                  className="add-skill-btn"
                  onClick={handleAddExperience}
                  type="button"
                >
                  + Add Experience
                </button>)
                    }

                
              </div>
                     {experiences?.length > 0 && (
  <div className="skills-list">
    {experiences.map((exp, index) => (
      <div key={exp._id || index} className="skill-item">
        <div>
          {/* <strong>{exp.title}</strong> at{" "} */}
          <span>{exp.company}</span><br />
          <small>{exp.duration || ""}</small>
          <p style={{ marginTop: "5px", color: "#555" }}>{exp.description}</p>
        </div>
        <button
          className="remove-skill"
          onClick={() => handleRemoveExperience(index, exp._id)}
          type="button"
        >
          <DeleteOutlineIcon sx={{ color:"#0077B5" }}/>
        </button>
        <button
          className="remove-skill"
          onClick={() => handleEditExperience(index,exp._id)}
          type="button"
        >
          <EditIcon sx={{ color:"#0077B5" }}/>
        </button> 
      </div>
    ))}
  </div>
)}


             
            </>
          )}

          {/* === SKILLS === */}
          {activeSection === "skills" && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label>Skill Name</label>
                  <input
                    type="text"
                    placeholder="e.g. ReactJS, Python"
                    value={skillInput.name}
                    onChange={e =>
                      setSkillInput({ ...skillInput, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Proficiency</label>
                  <select
                    value={skillInput.level}
                    onChange={e =>
                      setSkillInput({ ...skillInput, level: e.target.value })
                    }
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>

              <div
                className="form-actions"
                style={{ justifyContent: "flex-start" }}
              >
                {editSkillIndex !==null ?(
                  <button
                  className="add-skill-btn"
                  onClick={handleSaveSkillChanges}
                  type="button"
                >
                  Save Changes
                </button>
                ):(
                  <button
                  className="add-skill-btn"
                  onClick={handleAddSkill}
                  type="button"
                >
                  + Add Skill
                </button>
                )}
              </div>

              {skills.length > 0 && (
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <strong>{skill.name}</strong>    <span>{skill.level}</span>
                      <button
                              className="edit-skill"
                              onClick={() => handleEditSkill(index,skill?._id)}
                              type="button"
                              style={{ marginRight: "8px" }}
                            >
                              ✎
                            </button>
                            <button
                              className="remove-skill"
                              onClick={() => handleRemoveSkill(skill?._id)}
                              type="button"
                            >
                              ✕
                            </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* === CURRENT POSITION === */}
          {activeSection === "current" && (
             <>
              <div className="form-grid">
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" placeholder="Current company name"  value={ currentPositionInputs.company} onChange={e=>
                    setCurrentPositionInputs({...currentPositionInputs,
                      company:e.target.value
                    })
                  }/>
                </div>
                <div className="form-group">
                  <label>Role / Position</label>
                  <input type="text" placeholder="Your current role" value={currentPositionInputs.role} onChange={e=>
                    setCurrentPositionInputs({...currentPositionInputs,
                      role:e.target.value
                    })}
                    />
                </div>
                <div className="form-group">
                  <label>Employment Type</label>
                  <select 
                  value={currentPositionInputs.employmentType} onChange={e=>
                    setCurrentPositionInputs({...currentPositionInputs,
                      employmentType:e.target.value
                    })}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" 
                   value={currentPositionInputs.startDate} onChange={e=>
                    setCurrentPositionInputs({...currentPositionInputs,
                      startDate:e.target.value
                    })
                  }/>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" placeholder="City / Remote"  value={currentPositionInputs.location} onChange={e=>
                    setCurrentPositionInputs({...currentPositionInputs,
                      location:e.target.value
                    })
                  }/>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your current responsibilities..."   value={currentPositionInputs.description}
                onChange={e=>
                    setCurrentPositionInputs({...currentPositionInputs,
                      description:e.target.value
                    })
                }
                ></textarea>
              </div>
                <div
                className="form-actions"
                style={{ justifyContent: "flex-start" }}
                  >


                      {currentPositionEditingIndex !==null?(
                        <button
                  className="add-skill-btn"
                  onClick={handleSaveCurrentPositionChanges}
                  type="button"
                >
                  Save Changes
                </button>
                      ):(<button
                  className="add-skill-btn"
                  onClick={handleAddCurrentPosition}
                  type="button"
                >
                  + Add Current Position
                </button>)
                    }

                
              </div>



              {
                currentPositions?.length>0 &&(
                    <div className="skills-list">
                     {currentPositions.map((pos, index) => (
      <div key={pos._id || index} className="skill-item">
        <div>
          {/* <strong>{exp.title}</strong> at{" "} */}
          <span>{pos.company}</span><br />
          <small>{pos.startDate || ""}</small>
          <p style={{ marginTop: "5px", color: "#555" }}>{pos.description}</p>
        </div>
        <button
          className="remove-skill"
          onClick={() => handleRemoveCurrentPosition(index, pos._id)}
          type="button"
        >
          <DeleteOutlineIcon sx={{ color:"#0077B5" }}/>
        </button>
        <button
          className="remove-skill"
          onClick={() => handleEditCurrentPosition(index,pos._id)}
          type="button"
        >
          <EditIcon sx={{ color:"#0077B5" }}/>
        </button> 
      </div>
    ))}
                    </div>
                )
              }
            </>
          )}

         

          {/* <div className="form-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="reset" className="cancel-btn">
              Cancel
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
