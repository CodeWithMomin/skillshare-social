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
const CompleteProfile = () => {
const [userData,setUserData]=useState([])


 const {user,getUserProfile}=useAuth();
 const navigate=useNavigate()
  const {addEducation,updateEducation,deleteEducation}=useEdu()
  const {addExperience,updateExperience,deleteExperience
  }=useExp()
  const {addInternships,deleteInternships,updateInternships}=useInternship()
  const sections = [
    { id: "basic", name: "Basic Info" },
    { id: "language", name: "Language" },
    { id: "education", name: "Education" },
    { id: "internships", name: "Internships" },
    { id: "experience", name: "Experience" },
    { id: "skills", name: "Skills" },
    { id: "current", name: "Current Position" },
    { id: "contact", name: "Contact" },
  ];
 
  const [activeSection, setActiveSection] = useState("basic");
  // Skills state

  // --- Skill Management States ---
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState({ name: "", level: "Beginner" });

  // For editing existing skills
  const [editIndex, setEditIndex] = useState(null);
  const [editSkill, setEditSkill] = useState({ name: "", level: "Beginner" });

  // --- Handlers ---

  // Add a new skill
  const handleAddSkill = () => {
    if (!skillInput.name.trim()) return;
    setSkills([...skills, skillInput]);
    setSkillInput({ name: "", level: "Beginner" });
  };

  // Remove a skill
  const handleRemoveSkill = index => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  // Start editing a skill
  const handleEditSkill = index => {
    setEditIndex(index);
    setEditSkill(skills[index]);
  };

  // Save an edited skill
  const handleSaveSkill = index => {
    if (!editSkill.name.trim()) return;
    const updatedSkills = [...skills];
    updatedSkills[index] = editSkill;
    setSkills(updatedSkills);
    setEditIndex(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditSkill({ name: "", level: "Beginner" });
  };

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
    // console.log("Selected Education",selectedEducation);
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
  console.log(educationId,educationInput);
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
  const handleRemoveInternship = index => {
    const updatedInternships = internships.filter((_, i) => i !== index);
    setInternships(updatedInternships);
  };

  // --- Language States ---
  const [languages, setLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState({
    name: "",
    level: "Beginner",
  });

  // Edit states
  const [editLangIndex, setEditLangIndex] = useState(null);
  const [editLanguage, setEditLanguage] = useState({
    name: "",
    level: "Beginner",
  });

  // --- Handlers ---

  // Add a language
  const handleAddLanguage = () => {
    if (!languageInput.name.trim()) return;
    setLanguages([...languages, languageInput]);
    setLanguageInput({ name: "", level: "Beginner" });
  };

  // Remove a language
  const handleRemoveLanguage = index => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
  };

  // Edit language
  const handleEditLanguage = index => {
    setEditLangIndex(index);
    setEditLanguage(languages[index]);
  };

  // Save edited language
  const handleSaveLanguage = index => {
    if (!editLanguage.name.trim()) return;
    const updatedLanguages = [...languages];
    updatedLanguages[index] = editLanguage;
    setLanguages(updatedLanguages);
    setEditLangIndex(null);
  };

const [basicInfo, setBasicInfo] = useState({
  fullName: "",
  phoneNo: "",
  location: "",
  bio: "",
});

 
  // const [educationEditingIndex, setEducationEditingIndex] = useState(null);


  const handleChangeBasic = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };
const handleBasicInfoSave=()=>{
console.log(basicInfo);

}
useEffect(() => {
      const fetchUserProfile = async () => {
        
        
        try {
        const data = await getUserProfile(); // data is already JSON here
        
        // console.log("Profile Data",data);
        
        setUserData(data);
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
                  <input type="text" placeholder="Enter your full name" name="fullName" value={basicInfo.fullName}  onChange={handleChangeBasic}/>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your email" name="email" disabled value={basicInfo.email} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" placeholder="Enter your phone number" name="phoneNo" value={basicInfo.phoneNo}   onChange={handleChangeBasic} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" placeholder="City, Country" value={basicInfo.location}  name="location"  onChange={handleChangeBasic}/>
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea placeholder="Write a short bio..." value={basicInfo.bio} name="bio"  onChange={handleChangeBasic}></textarea>
              </div>
              <div className="form-actions">
            <button  className="save-btn" onClick={handleBasicInfoSave}>
              Save
            </button>
            <button type="reset" className="cancel-btn">
              Cancel
            </button>
          </div>
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
                    value={languageInput.level}
                    onChange={e =>
                      setLanguageInput({
                        ...languageInput,
                        level: e.target.value,
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
                <button
                  className="add-skill-btn"
                  onClick={handleAddLanguage}
                  type="button"
                >
                  + Add Language
                </button>
              </div>

              {languages.length > 0 && (
                <div className="skills-list">
                  {languages.map((lang, index) => (
                    <div key={index} className="skill-item">
                      {editLangIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editLanguage.name}
                            onChange={e =>
                              setEditLanguage({
                                ...editLanguage,
                                name: e.target.value,
                              })
                            }
                            style={{ width: "45%", marginRight: "8px" }}
                          />
                          <select
                            value={editLanguage.level}
                            onChange={e =>
                              setEditLanguage({
                                ...editLanguage,
                                level: e.target.value,
                              })
                            }
                            style={{ width: "30%", marginRight: "8px" }}
                          >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Fluent</option>
                            <option>Native</option>
                          </select>
                          <button
                            className="save-skill"
                            type="button"
                            onClick={() => handleSaveLanguage(index)}
                          >
                            💾
                          </button>
                          <button
                            className="cancel-edit"
                            type="button"
                            onClick={() => setEditLangIndex(null)}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span>
                            {lang.name} — <em>{lang.level}</em>
                          </span>
                          <div>
                            <button
                              className="edit-skill"
                              onClick={() => handleEditLanguage(index)}
                              type="button"
                              style={{ marginRight: "8px" }}
                            >
                              ✎
                            </button>
                            <button
                              className="remove-skill"
                              onClick={() => handleRemoveLanguage(index)}
                              type="button"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      )}
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
                <button
                  className="add-skill-btn"
                  onClick={handleAddInternship}
                  type="button"
                >
                  + Add Internship
                </button>
              </div>

              {internships.length > 0 && (
                <div className="skills-list">
                  {internships.map((intern, index) => (
                    <div key={index} className="skill-item">
                      <div>
                        <strong>{intern.role}</strong> at{" "}
                        <span>{intern.organization}</span>
                        <br />
                        <small>{intern.duration}</small>
                        <p style={{ marginTop: "5px", color: "#555" }}>
                          {intern.description}
                        </p>
                      </div>
                      <button
                        className="remove-skill"
                        onClick={() => handleRemoveInternship(index)}
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
                <button
                  className="add-skill-btn"
                  onClick={handleAddSkill}
                  type="button"
                >
                  + Add Skill
                </button>
              </div>

              {skills.length > 0 && (
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      {editIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editSkill.name}
                            onChange={e =>
                              setEditSkill({
                                ...editSkill,
                                name: e.target.value,
                              })
                            }
                            style={{ width: "45%", marginRight: "8px" }}
                          />
                          <select
                            value={editSkill.level}
                            onChange={e =>
                              setEditSkill({
                                ...editSkill,
                                level: e.target.value,
                              })
                            }
                            style={{ width: "30%", marginRight: "8px" }}
                          >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Expert</option>
                          </select>
                          <button
                            className="save-skill"
                            type="button"
                            onClick={() => handleSaveSkill(index)}
                          >
                            💾
                          </button>
                          <button
                            className="cancel-edit"
                            type="button"
                            onClick={() => setEditIndex(null)}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span>
                            {skill.name} — <em>{skill.level}</em>
                          </span>
                          <div>
                            <button
                              className="edit-skill"
                              onClick={() => handleEditSkill(index)}
                              type="button"
                              style={{ marginRight: "8px" }}
                            >
                              ✎
                            </button>
                            <button
                              className="remove-skill"
                              onClick={() => handleRemoveSkill(index)}
                              type="button"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      )}
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
                  <input type="text" placeholder="Current company name" />
                </div>
                <div className="form-group">
                  <label>Role / Position</label>
                  <input type="text" placeholder="Your current role" />
                </div>
                <div className="form-group">
                  <label>Employment Type</label>
                  <select>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="month" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" placeholder="City / Remote" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your current responsibilities..."></textarea>
              </div>
            </>
          )}

          {/* === CONTACT === */}
          {activeSection === "contact" && (
            <div className="form-grid">
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter contact email" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" placeholder="Enter contact number" />
              </div>
              <div className="form-group">
                <label>LinkedIn / Portfolio</label>
                <input type="text" placeholder="Profile or website link" />
              </div>
            </div>
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
