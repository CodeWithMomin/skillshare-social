import React, { useState,useEffect } from "react";
import "../App.css"; // Make sure to use the css below
import { useEdu } from "../context/EducationContext";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultProfile = {
  basic: {
    fullName: "",
    email: "",
    phone: "",
    headline: "",
    bio: "",
    location: "",
    photo: ""
  },
  languages: [],
  education: [],
  experience: [],
  internships: [],
  skills: [],
  current: {
    company: "",
    title: "",
    start: "",
    type: ""
  },
  contact: {
    email: "",
    phone: "",
    links: ""
  }
};

const CompleteProfile = () => {
  const {addEducation,updateEducation,deleteEducation}=useEdu()
  const {getUserProfile}=useAuth()
  // State
  const [basic, setBasic] = useState({ ...defaultProfile.basic });
  const [languages, setLanguages] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [internships, setInternships] = useState([]);
  const [skills, setSkills] = useState([]);
  const [current, setCurrent] = useState({ ...defaultProfile.current });
  const [contact, setContact] = useState({ ...defaultProfile.contact });

  const [editSection, setEditSection] = useState({
    basic: false, languages: false, education: false, experience: false,
    internships: false, skills: false, current: false, contact: false
  });

  // Error states
  const [basicErrors, setBasicErrors] = useState({});
  const [langErrors, setLangErrors] = useState({});
  const [eduErrors, setEduErrors] = useState({});
  const [expErrors, setExpErrors] = useState({});
  const [internErrors, setInternErrors] = useState({});
  const [skillErrors, setSkillErrors] = useState({});
  const [currentErrors, setCurrentErrors] = useState({});
  const [contactErrors, setContactErrors] = useState({});
  const [userData,setUserData]=useState([])
   useEffect(() => {
      const fetchUserProfile = async () => {
        try {
        const data = await getUserProfile(); // data is already JSON here
        // console.log(data);
        // console.log(token);
        // console.log("Profile Data",data);
        
        setUserData(data);
        console.log((data));
        
        
      } catch (error) {
        console.error(error.message);
         toast("error:", error);
      } 
      };
   fetchUserProfile();
      
    }, []);

    useEffect(() => {
  if (userData && userData.education) {
    setEducation(userData.education); // sync local editable state
  }
}, [userData.education]);

  // Validators
  function validateBasic(val) {
    let err = {};
    if (!val.fullName) err.fullName = "Full name required.";
    // if (!val.email || !emailRegex.test(val.email)) err.email = "Valid email required.";
    if (val.phone && !/^[\d\+\-]+$/.test(val.phone)) err.phone = "Phone: digits or + - only.";
    return err;
  }
  function validateLang(list) {
    let out = {};
    list.forEach((x, i) => { if (!x.language) out[i] = "Language required."; });
    return out;
  }
  function validateEdu(list) {
    let out = {};
    list.forEach((x, i) => {
      if (!x.school) out[i + 'school'] = "School required.";
      if (!x.degree) out[i + 'degree'] = "Degree required.";
    });
    return out;
  }
  function validateExp(list) {
    let out = {};
    list.forEach((x, i) => {
      if (!x.company) out[i + 'company'] = "Company required.";
      if (!x.title) out[i + 'title'] = "Title required.";
    });
    return out;
  }
  function validateIntern(list) {
    let out = {};
    list.forEach((x, i) => {
      if (!x.company) out[i + 'company'] = "Company required.";
      if (!x.role) out[i + 'role'] = "Role required.";
    });
    return out;
  }
  function validateSkill(list) {
    let out = {};
    list.forEach((x, i) => {
      if (!x.name) out[i + 'name'] = "Skill required.";
    });
    return out;
  }
  function validateCurrent(val) {
    let err = {};
    if (!val.company) err.company = "Company required.";
    if (!val.title) err.title = "Title required.";
    return err;
  }
  function validateContact(val) {
    let err = {};
    if (!val.email || !emailRegex.test(val.email)) err.email = "Valid email required.";
    if (val.phone && !/^[\d\+\-]+$/.test(val.phone)) err.phone = "Digits or + - only.";
    return err;
  }

  // --- Change/Save/Edit/Cancel for all sections
  // Basic
  function handleBasicChange(e) { setBasic({ ...basic, [e.target.name]: e.target.value }); setBasicErrors({}); 
  
}
  function editBasic() { setEditSection({ ...editSection, basic: true });

 }
    function saveBasic(e) {
     e.preventDefault(); 
     const err = validateBasic(basic); 
     if (Object.keys(err).length) return setBasicErrors(err);
      setEditSection({ ...editSection, basic: false });
    // console.log(basic);
     
  }
  function cancelBasic() { setEditSection({ ...editSection, basic: false }); setBasicErrors({}); }

  // Languages
  function addLanguage() { setLanguages([...languages, { language: "", proficiency: "Beginner" }]); setEditSection({ ...editSection, languages: true }); }
  function handleLanguageChange(i, e) { setLanguages(languages.map((x, idx) => idx === i ? { ...x, [e.target.name]: e.target.value } : x)); setLangErrors({}); }
  function removeLanguage(i) { setLanguages(languages.filter((_, idx) => idx !== i)); setLangErrors({}); }
  function editLanguages() { setEditSection({ ...editSection, languages: true }); }
  
  
 async  function saveLanguages(e) {
     e.preventDefault();
      const err = validateLang(languages);
       if (Object.keys(err).length) return setLangErrors(err); 
       setEditSection({ ...editSection, languages: false });
        console.log(languages);

    try {
  const { success, error, data } = await addLanguage(education[0]);
  if (success) {
    console.log("Education saved successfully:", data);
    setEducation([...defaultProfile.education]);
    toast.success("Education Added Successfully.",{
      duration:1000,
      position:"top-center",
      style: {
    
  }
    })
  } else {
    // console.error("API failed:", error);
    toast.error("API failed.")
  }
} catch (error) {
  console.error("Save Education API error:", error);
   toast("API error:", error);
}





   }
  function cancelLanguages() { setEditSection({ ...editSection, languages: false }); setLangErrors({}); }

  // Education
  function addeducation() { 
    setEducation([...education, { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", grade: "" }]);
     setEditSection({ ...editSection, education: true });
     }
  function handleEducationChange(i, e) { setEducation(education.map((x, idx) => idx === i ? { ...x, [e.target.name]: e.target.value } : x)); setEduErrors({}); }
  async function removeEducation( eduId, idx) { 
  const userId = userData?._id;
  console.log(userId,eduId);
  
  if (userId && eduId != null) {
    try {
      const { success, error, data } = await deleteEducation(eduId);
      if (success) {
        toast.success("Education Removed Successfully.", {
          duration: 1000,
          position: "top-center",
        });
        // Update local state by removing the deleted education entry
        setUserData(prev => ({
          ...prev,
          education: prev.education.filter((_, i) => i !== idx)
        }));
        setEducation(prev => prev.filter((_, i) => i !== idx));
      } else {
        toast.error(error || "Failed to remove education.");
      }
    } catch (error) {
      console.error("API error: " + error.message);
      console.error("Remove Education API error:", error);
    }
  } else {
    console.error("Missing user ID or education ID");
  }
}

  function editEducation(eduId,idx)
   { 
    const userId = userData?._id;
    // console.log("editing Education",eduData,i);
    
    // setEducation(userData.education || []);
    // setEditSection({ ...editSection, education: true });
   }
 async function saveEducation(e) {
   e.preventDefault();
     const err = validateEdu(education); 
     if (Object.keys(err).length) return setEduErrors(err);
      setEducation([]);

      // console.log(education);
       try {
  const { success, error, data } = await addEducation(education[0]);
  if (success) {
    console.log("Education saved successfully:", data);
    setUserData(prev => ({ ...prev, education: data }));
   setEditSection({ ...editSection, education: false });
    toast.success("Education Added Successfully.",{
      duration:1000,
      position:"top-center",
      style: {
    
  }
    })
  } else {
    // console.error("API failed:", error);
    toast.error("API failed.")
  }
} catch (error) {
  console.error("Save Education API error:", error);
   toast("API error:", error);
}
   }
  function cancelEducation() { setEditSection({ ...editSection, education: false }); setEduErrors({}); }

  // Experience
  function addExperience() { setExperience([...experience, { company: "", title: "", employmentType: "Full-time", location: "", startDate: "", endDate: "", currentlyWorking: false, description: "" }]); setEditSection({ ...editSection, experience: true }); }
  function handleExperienceChange(i, e) {
    const { name, value, type, checked } = e.target;
    setExperience(experience.map((x, idx) => idx === i ? { ...x, [name]: type === "checkbox" ? checked : value } : x));
    setExpErrors({});
  }
  function removeExperience(i) { setExperience(experience.filter((_, idx) => idx !== i)); }
  function editExperience() { setEditSection({ ...editSection, experience: true }); }
  function saveExperience(e) { e.preventDefault(); const err = validateExp(experience); if (Object.keys(err).length) return setExpErrors(err); setEditSection({ ...editSection, experience: false }); }
  function cancelExperience() { setEditSection({ ...editSection, experience: false }); setExpErrors({}); }

  // Internships
  function addInternship() { setInternships([...internships, { company: "", role: "", startDate: "", endDate: "", description: "" }]); setEditSection({ ...editSection, internships: true }); }
  function handleInternshipChange(i, e) { setInternships(internships.map((x, idx) => idx === i ? { ...x, [e.target.name]: e.target.value } : x)); setInternErrors({}); }
  function removeInternship(i) { setInternships(internships.filter((_, idx) => idx !== i)); }
  function editInternships() { setEditSection({ ...editSection, internships: true }); }
  function saveInternships(e) { e.preventDefault(); const err = validateIntern(internships); if (Object.keys(err).length) return setInternErrors(err); setEditSection({ ...editSection, internships: false }); }
  function cancelInternships() { setEditSection({ ...editSection, internships: false }); setInternErrors({}); }

  // Skills
  function addSkill() { setSkills([...skills, { name: "", level: "Beginner" }]); setEditSection({ ...editSection, skills: true }); }
  function handleSkillChange(i, e) { setSkills(skills.map((x, idx) => idx === i ? { ...x, [e.target.name]: e.target.value } : x)); setSkillErrors({}); }
  function removeSkill(i) { setSkills(skills.filter((_, idx) => idx !== i)); }
  function editSkills() { setEditSection({ ...editSection, skills: true }); }
  function saveSkills(e) { e.preventDefault(); const err = validateSkill(skills); if (Object.keys(err).length) return setSkillErrors(err); setEditSection({ ...editSection, skills: false }); }
  function cancelSkills() { setEditSection({ ...editSection, skills: false }); setSkillErrors({}); }

  // Current
  function handleCurrentChange(e) { setCurrent({ ...current, [e.target.name]: e.target.value }); setCurrentErrors({}); }
  function editCurrent() { setEditSection({ ...editSection, current: true }); }
  function saveCurrent(e) { e.preventDefault(); const err = validateCurrent(current); if (Object.keys(err).length) return setCurrentErrors(err); setEditSection({ ...editSection, current: false }); }
  function cancelCurrent() { setEditSection({ ...editSection, current: false }); setCurrentErrors({}); }

  // Contact
  function handleContactChange(e) { setContact({ ...contact, [e.target.name]: e.target.value }); setContactErrors({}); }
  function editContact() { setEditSection({ ...editSection, contact: true }); }
  function saveContact(e) { e.preventDefault(); const err = validateContact(contact); if (Object.keys(err).length) return setContactErrors(err); setEditSection({ ...editSection, contact: false }); }
  function cancelContact() { setEditSection({ ...editSection, contact: false }); setContactErrors({}); }

  // --------- RENDER ----------
  return (
    <div className="profile-center-card">

      {/* Basic */}
      <div className="profilecard">
        <h3 className="profilecard-title">Basic Info</h3>
        {!editSection.basic ? (
         <div>
  <div className="profilecard-viewrow"><label>Full Name</label><span>{userData.fullName || ' '}</span></div>
  <div className="profilecard-viewrow"><label>Email</label><span>{userData.email || ' '}</span></div>
  <div className="profilecard-viewrow"><label>Phone</label><span>{userData.phone || ' '}</span></div>
  <div className="profilecard-viewrow"><label>Headline</label><span>{userData.headline || '--'}</span></div>
  <div className="profilecard-viewrow"><label>Bio</label><span>{userData.bio || ' '}</span></div>
  <div className="profilecard-viewrow"><label>Location</label><span>{userData.location || ''}</span></div>
  <div className="profilecard-actions"><button className="edit-btn" onClick={editBasic}>Edit</button></div>
</div>

        ) : (
          <form onSubmit={saveBasic} className="profilecard-form">
            <div className="profilecard-group">
              <label>Full Name</label>
              <input className={basicErrors.fullName && "has-error"} name="fullName" value={basic.fullName} onChange={handleBasicChange} placeholder="Enter full name" />
              {basicErrors.fullName && <span className="errormsg">{basicErrors.fullName}</span>}
            </div>
            <div className="profilecard-group">
              <label>Email</label>
              <input className={basicErrors.email && "has-error"} disabled name="email" value={basic.email} onChange={handleBasicChange} placeholder="Email" />
              {basicErrors.email && <span className="errormsg">{basicErrors.email}</span>}
            </div>
            <div className="profilecard-group">
              <label>Phone</label>
              <input className={basicErrors.phone && "has-error"} name="phone" value={basic.phone} onChange={handleBasicChange} placeholder="Phone" />
              {basicErrors.phone && <span className="errormsg">{basicErrors.phone}</span>}
            </div>
            <div className="profilecard-group">
              <label>Headline</label>
              <input name="headline" value={basic.headline} onChange={handleBasicChange} placeholder="Headline" />
            </div>
            <div className="profilecard-group">
              <label>Bio</label>
              <textarea name="bio" value={basic.bio} onChange={handleBasicChange} placeholder="Bio"></textarea>
            </div>
            <div className="profilecard-group">
              <label>Location</label>
              <input name="location" value={basic.location} onChange={handleBasicChange} placeholder="Location" />
            </div>
            <div className="profilecard-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="close-btn" type="button" onClick={cancelBasic}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Languages */}
      <div className="profilecard">
        <h3 className="profilecard-title">Languages</h3>
        {!editSection.languages ? (
          <div>
            {languages.length === 0 ? <p className="profilecard-viewrow">None added</p> :
              languages.map((lang, idx) => (
                <div className="profilecard-viewrow" key={idx}>
                  <label>{lang.language}</label>
                  <span>{lang.proficiency}</span>
                </div>
              ))}
            <div className="profilecard-actions"><button className="edit-btn" onClick={editLanguages}>Edit</button></div>
          </div>
        ) : (
          <form onSubmit={saveLanguages} className="profilecard-form">
            {languages.map((lang, idx) => (
              <div className="profilecard-group" key={idx}>
                <label>Language</label>
                <input className={langErrors[idx] && "has-error"} name="language" value={lang.language} onChange={e => handleLanguageChange(idx, e)} placeholder="Language" />
                {langErrors[idx] && <span className="errormsg">{langErrors[idx]}</span>}
                <select name="proficiency" value={lang.proficiency} onChange={e => handleLanguageChange(idx, e)}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native">Native</option>
                </select>
                <button type="button" onClick={() => removeLanguage(idx)} style={{marginTop: "6px"}}>Remove</button>
              </div>
            ))}
            <button type="button" className="edit-btn" onClick={addLanguage}>Add Language</button>
            <div className="profilecard-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="close-btn" type="button" onClick={cancelLanguages}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Education */}
      <div className="profilecard">
        <h3 className="profilecard-title">Education</h3>
        {!editSection.education ? (
          <div>
            {education.length === 0 ? (
  <p className="profilecard-viewrow">None added</p>
) : (
  education.map((edu, idx) => (
    <div className="profilecard-viewrow" key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <label>{edu.school}</label>
        <span>{edu.degree}</span>
      </div>
      <div>
        <button style={{ marginRight: "8px" }} onClick={() => editEducation(edu._id,idx)}>Edit</button>
        <button onClick={() => removeEducation(edu._id,idx)}>Delete</button>
      </div>
    </div>
  ))
)}

            <div className="profilecard-actions"><button className="edit-btn" onClick={editEducation}>Edit</button></div>
          </div>
        ) : (
          <form onSubmit={saveEducation} className="profilecard-form">
            {education.map((edu, idx) => (
              <div className="profilecard-group" key={idx}>
                <label>College/University</label>
                <input className={eduErrors[idx+'school'] && "has-error"} name="school" value={edu.school} onChange={e => handleEducationChange(idx, e)} placeholder="School" />
                {eduErrors[idx+'school'] && <span className="errormsg">{eduErrors[idx+'school']}</span>}
                <label>Degree</label>
                <input className={eduErrors[idx+'degree'] && "has-error"} name="degree" value={edu.degree} onChange={e => handleEducationChange(idx, e)} placeholder="Degree" />
                {eduErrors[idx+'degree'] && <span className="errormsg">{eduErrors[idx+'degree']}</span>}
                <label>Field of Study</label>
                <input name="fieldOfStudy" value={edu.fieldOfStudy} onChange={e => handleEducationChange(idx, e)} placeholder="Field of Study" />
                <label>Start Date</label>
                <input name="startDate" value={edu.startDate} onChange={e => handleEducationChange(idx, e)} placeholder="Start Date" />
                <label>End Date</label>
                <input name="endDate" value={edu.endDate} onChange={e => handleEducationChange(idx, e)} placeholder="End Date" />
                <label>Grade</label>
                <input name="grade" value={edu.grade} onChange={e => handleEducationChange(idx, e)} placeholder="Grade" />
                <button type="button" onClick={() => removeEducation(idx)} style={{marginTop: "6px"}}>Remove</button>
              </div>
            ))}
            <button type="button" className="edit-btn" onClick={addeducation}>Add Education</button>
            <div className="profilecard-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="close-btn" type="button" onClick={cancelEducation}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Experience */}
      <div className="profilecard">
        <h3 className="profilecard-title">Experience</h3>
        {!editSection.experience ? (
          <div>
            {experience.length === 0 ? <p className="profilecard-viewrow">None added</p> :
              experience.map((exp, idx) => (
                <div className="profilecard-viewrow" key={idx}>
                  <label>{exp.company}</label>
                  <span>{exp.title}</span>
                </div>
              ))}
            <div className="profilecard-actions"><button className="edit-btn" onClick={editExperience}>Edit</button></div>
          </div>
        ) : (
          <form onSubmit={saveExperience} className="profilecard-form">
            {experience.map((exp, idx) => (
              <div className="profilecard-group" key={idx}>
                <label>Company</label>
                <input className={expErrors[idx+'company'] && "has-error"} name="company" value={exp.company} onChange={e => handleExperienceChange(idx, e)} placeholder="Company" />
                {expErrors[idx+'company'] && <span className="errormsg">{expErrors[idx+'company']}</span>}
                <label>Title</label>
                <input className={expErrors[idx+'title'] && "has-error"} name="title" value={exp.title} onChange={e => handleExperienceChange(idx, e)} placeholder="Title" />
                {expErrors[idx+'title'] && <span className="errormsg">{expErrors[idx+'title']}</span>}
                <label>Employment Type</label>
                <select name="employmentType" value={exp.employmentType} onChange={e => handleExperienceChange(idx, e)}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                <label>Location</label>
                <input name="location" value={exp.location} onChange={e => handleExperienceChange(idx, e)} placeholder="Location" />
                <label>Start Date</label>
                <input name="startDate" value={exp.startDate} onChange={e => handleExperienceChange(idx, e)} placeholder="Start Date" />
                <label>End Date</label>
                <input name="endDate" value={exp.endDate} onChange={e => handleExperienceChange(idx, e)} placeholder="End Date" />
                <label><input name="currentlyWorking" type="checkbox" checked={exp.currentlyWorking} onChange={e => handleExperienceChange(idx, e)} /> Currently Working</label>
                <label>Description</label>
                <textarea name="description" value={exp.description} onChange={e => handleExperienceChange(idx, e)} placeholder="Description"></textarea>
                <button type="button" onClick={() => removeExperience(idx)} style={{marginTop: "6px"}}>Remove</button>
              </div>
            ))}
            <button type="button" className="edit-btn" onClick={addExperience}>Add Experience</button>
            <div className="profilecard-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="close-btn" type="button" onClick={cancelExperience}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Internships */}
      <div className="profilecard">
        <h3 className="profilecard-title">Internships</h3>
        {!editSection.internships ? (
          <div>
            {internships.length === 0 ? <p className="profilecard-viewrow">None added</p> :
              internships.map((intern, idx) => (
                <div className="profilecard-viewrow" key={idx}>
                  <label>{intern.company}</label>
                  <span>{intern.role}</span>
                </div>
              ))}
            <div className="profilecard-actions"><button className="edit-btn" onClick={editInternships}>Edit</button></div>
          </div>
        ) : (
          <form onSubmit={saveInternships} className="profilecard-form">
            {internships.map((intern, idx) => (
              <div className="profilecard-group" key={idx}>
                <label>Company</label>
                <input className={internErrors[idx+'company'] && "has-error"} name="company" value={intern.company} onChange={e => handleInternshipChange(idx, e)} placeholder="Company" />
                {internErrors[idx+'company'] && <span className="errormsg">{internErrors[idx+'company']}</span>}
                <label>Role</label>
                <input className={internErrors[idx+'role'] && "has-error"} name="role" value={intern.role} onChange={e => handleInternshipChange(idx, e)} placeholder="Role" />
                {internErrors[idx+'role'] && <span className="errormsg">{internErrors[idx+'role']}</span>}
                <label>Start Date</label>
                <input name="startDate" value={intern.startDate} onChange={e => handleInternshipChange(idx, e)} placeholder="Start Date" />
                <label>End Date</label>
                <input name="endDate" value={intern.endDate} onChange={e => handleInternshipChange(idx, e)} placeholder="End Date" />
                <label>Description</label>
                <textarea name="description" value={intern.description} onChange={e => handleInternshipChange(idx, e)} placeholder="Description"></textarea>
                <button type="button" onClick={() => removeInternship(idx)} style={{marginTop: "6px"}}>Remove</button>
              </div>
            ))}
            <button type="button" className="edit-btn" onClick={addInternship}>Add Internship</button>
            <div className="profilecard-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="close-btn" type="button" onClick={cancelInternships}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Skills */}
      <div className="profilecard">
        <h3 className="profilecard-title">Skills</h3>
        {!editSection.skills ? (
          <div>
            {skills.length === 0 ? (
              <p className="profilecard-viewrow">None added</p>
            ) : (
              skills.map((skill, idx) => (
                <div className="profilecard-viewrow" key={idx}>
                  <label>{skill.name}</label>
                  <span>{skill.level}</span>
                </div>
              ))
            )}
            <div className="profilecard-actions">
              <button className="edit-btn" onClick={editSkills}>Edit</button>
            </div>
          </div>
        ) : (
          <form onSubmit={saveSkills} className="profilecard-form">
            {skills.map((skill, idx) => (
              <div className="profilecard-group" key={idx}>
                <label>Skill Name</label>
                <input
                  className={skillErrors[idx + 'name'] && "has-error"}
                  name="name"
                  value={skill.name}
                  onChange={e => handleSkillChange(idx, e)}
                  placeholder="Skill name"
                />
                {skillErrors[idx + 'name'] && (
                  <span className="errormsg">{skillErrors[idx + 'name']}</span>
                )}
                <select
                  name="level"
                  value={skill.level}
                  onChange={e => handleSkillChange(idx, e)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button type="button" onClick={() => removeSkill(idx)} style={{ marginTop: "6px" }}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="edit-btn" onClick={addSkill}>
              Add Skill
            </button>
            <div className="profilecard-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="close-btn" type="button" onClick={cancelSkills}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Current */}
      <div className="profilecard">
        <h3 className="profilecard-title">Current Position</h3>
        {!editSection.current ? (
          <div>
            <div className="profilecard-viewrow"><label>Company</label><span>{current.company || '--'}</span></div>
            <div className="profilecard-viewrow"><label>Title</label><span>{current.title || '--'}</span></div>
            <div className="profilecard-viewrow"><label>Start</label><span>{current.start || '--'}</span></div>
            <div className="profilecard-viewrow"><label>Type</label><span>{current.type}</span></div>
            <div className="profilecard-actions"><button className="edit-btn" onClick={editCurrent}>Edit</button></div>
          </div>
        ) : (
          <form onSubmit={saveCurrent} className="profilecard-form">
            <div className="profilecard-group">
              <label>Company</label>
              <input className={currentErrors.company && "has-error"} name="company" value={current.company} onChange={handleCurrentChange} placeholder="Company" />
              {currentErrors.company && <span className="errormsg">{currentErrors.company}</span>}
            </div>
            <div className="profilecard-group">
              <label>Title</label>
              <input className={currentErrors.title && "has-error"} name="title" value={current.title} onChange={handleCurrentChange} placeholder="Title" />
              {currentErrors.title && <span className="errormsg">{currentErrors.title}</span>}
            </div>
            <div className="profilecard-group">
              <label>Start Date</label>
              <input name="start" value={current.start} onChange={handleCurrentChange} placeholder="Start Date" />
            </div>
            <div className="profilecard-group">
              <label>Type</label>
              <select name="type" value={current.type} onChange={handleCurrentChange}>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="profilecard-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="close-btn" type="button" onClick={cancelCurrent}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Contact */}
      <div className="profilecard">
        <h3 className="profilecard-title">Contact Info</h3>
        {!editSection.contact ? (
          <div>
            <div className="profilecard-viewrow"><label>Email</label><span>{contact.email || '--'}</span></div>
            <div className="profilecard-viewrow"><label>Phone</label><span>{contact.phone || '--'}</span></div>
            <div className="profilecard-viewrow"><label>Links</label><span>{contact.links || '--'}</span></div>
            <div className="profilecard-actions"><button className="edit-btn" onClick={editContact}>Edit</button></div>
          </div>
        ) : (
          <form onSubmit={saveContact} className="profilecard-form">
            <div className="profilecard-group">
              <label>Email</label>
              <input className={contactErrors.email && "has-error"} name="email" value={contact.email} onChange={handleContactChange} placeholder="Email" />
              {contactErrors.email && <span className="errormsg">{contactErrors.email}</span>}
            </div>
            <div className="profilecard-group">
              <label>Phone</label>
              <input className={contactErrors.phone && "has-error"} name="phone" value={contact.phone} onChange={handleContactChange} placeholder="Phone" />
              {contactErrors.phone && <span className="errormsg">{contactErrors.phone}</span>}
            </div>
            <div className="profilecard-group">
              <label>Links</label>
              <input name="links" value={contact.links} onChange={handleContactChange} placeholder="Social/Portfolio link(s)" />
            </div>
            <div className="profilecard-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="close-btn" type="button" onClick={cancelContact}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default CompleteProfile;
