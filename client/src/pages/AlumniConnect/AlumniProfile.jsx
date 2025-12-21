import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Card,
  createTheme,
  CardContent,
  ThemeProvider,
  Avatar,
  avatarGroupClasses,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";

const AlumniProfile = () => {
 const localTheme = createTheme({
  palette: {
    primary: {
      main: "#f89807", // your orange
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#222221", // your dark text color
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#222221",
      secondary: "#444444",
    },
  },

  typography: {
    fontFamily: "Poppins, Inter, sans-serif",
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      fontWeight: 600,
      textTransform: "none",
      fontSize: "0.95rem",
    },
  },

  shape: {
    borderRadius: 10, // matches your inputs + CSS
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 0 20px rgba(0,0,0,0.05)",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            fontSize: "0.95rem",
            "& fieldset": {
              borderColor: "#ccc",
              borderWidth: "1.8px",
            },
            "&:hover fieldset": {
              borderColor: "#f89807",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#f89807",
              boxShadow: "0 0 0 3px rgba(248,152,7,0.15)",
            },
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#f89807",
          boxShadow: "0 4px 10px rgba(248,152,7,0.3)",
          padding: "10px 18px",
          "&:hover": {
            backgroundColor: "#e08706",
          },
        },
        outlinedPrimary: {
          borderColor: "#f89807",
          color: "#f89807",
          "&:hover": {
            borderColor: "#e08706",
            backgroundColor: "rgba(248,152,7,0.06)",
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginBottom: 8,
          "&.Mui-selected": {
            backgroundColor: "#f89807",
            color: "#fff",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(248,152,7,0.3)",
          },
          "&:hover": {
            backgroundColor: "#fff3e0",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: "#fff8f0",
          border: "1.5px solid #f89807",
          borderRadius: 20,
          boxShadow: "0 2px 6px rgba(248,152,7,0.15)",
        },
      },
    },
  },
});
const [profilePic, setProfilePic] = useState(null);
const [profilePicPreview, setProfilePicPreview] = useState(null);

const handleProfilePicUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
  }
};
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("basic");

  const sections = [
    { id: "basic", name: "Basic Info" },
    { id: "language", name: "Language" },
    { id: "Acadmic", name: "Acadmic" },
    { id: "acheivements", name: "Acheivements" },
    {id:"alumniInfo",name:"AlumniInfo"}
  ];

  // ---------------- STATES (Same as yours) ----------------
 

  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    phoneNo: "",
    location: "",
    bio: "",
    portfolioLink: "",
    linkedInUrl: "",
  });

  const [basicInformation, setBasicInformation] = useState([]);
  const [basicinfoIndex, setBasicInfoIndex] = useState(null);
  const [basicInfoId, setBasicInfoId] = useState(null);

  const handleBasicChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };
  const handleSaveBasicChange=(e)=>{

  }
  const handleSaveBasicInfo=()=>{
    console.log(basicInfo)
  }
 





const [academicInput, setAcademicInput] = useState({
  university: "",
  degree: "",
  department: "",
  enrollmentYear: "",
  graduationYear: "",
  cgpa: "",
});
const [academics, setAcademics] = useState([]);
const [editAcademicIndex, setEditAcademicIndex] = useState(null);

const [academicInfoId, setAcadmicInfoId] = useState(null);

const handleSaveAcademicChanges=()=>{

}
const handleAddAcademics=()=>{
console.log(academicInput);

}
const handleEditAcademics=()=>{

}
const handleRemoveAcademics=()=>{

}

const [languages, setLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState({
    name: "",
    proficiency: "Beginner",
  });
  const [editLangIndex, setEditLangIndex] = useState(null);
  const [editLangId, setEditLangId] = useState(null);
  const handleSaveLanguageChanges=()=>{

  }
  const handleAddLanguage=()=>{
    console.log(languageInput);
    
  }
  const handleEditLanguage=()=>{
   
  }
 const handleRemoveLanguage=()=>{

    }




const [achievements, setAchievements] = useState([]);
const [achievementInput, setAchievementInput] = useState({
  title: "",
  organization: "",
  issueDate: "",
  certificateUrl: "",
  description: ""
});

const [editAchIndex, setEditAchIndex] = useState(null);
const [eidtAchId,setEditAchId]=useState(null)



const handleSaveAchievementChanges=()=>{

}
const handleAddAchievements=()=>{
console.log(achievementInput);

}
const handleEditAchievement=()=>{

}
const handleRemoveAchievement=()=>{

}



 const [alumniInfo, setAlumniInfo] = useState([]);

const [alumniInput, setAlumniInput] = useState({
  company: "",
  position: "",
  experience: "",
  startDate: "",
  additionalInfo: "",
});

const [editAlumniIndex, setEditAlumniIndex] = useState(null);
const [editAlumniId,setEditAcademicId]=useState(null)

const handleSaveAlumniChanges=()=>{

}
const handleAddAlumniInfo=()=>{
console.log(alumniInput);

}
const handleEditAlumniInfo=()=>{

}
const handleRemoveAlumniInfo=()=>{

}












  const renderBasicInfo = () => (
  <>
    <Box
      sx={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        p: 2,
        borderRadius: 3,
        // border: "1.5px solid #f89807",
        boxShadow: "0 2px 10px rgba(248,152,7,0.15)",
        mb: 3,
      }}
    >
      {/* LEFT: PROFILE PIC UPLOAD BOX */}
     <Box
  sx={{
    width: 240,
    height:330,
    border: "1px solid grey",
    borderRadius: 3,
    p: 2,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    justifyContent: "center",
  }}
>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: 600, mb: 2 }}>
          Upload ProfilePic
        </Typography>

        <Avatar
  src={profilePicPreview || ""}
  alt="Profile"
  sx={{
    width: 120,
    height: 120,
    border: "3px solid #f89807",
    marginBottom: "15px",
    objectFit: "cover",
    backgroundColor: "#f0f0f0", // shows light BG when no image
    fontSize: "2rem",
    color: "#555",
  }}
>
  {!profilePicPreview && "?"}  {/* Placeholder icon/letter */}
</Avatar>


        {/* PROFILE PIC UPLOAD */}
        <Button
          variant="outlined"
          component="label"
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: 600,
            borderColor: "#f89807",
            color: "#f89807",
          }}
        >
          Upload
          <input
            type="file"
            hidden
            onChange={handleProfilePicUpload} // separate state handler
          />
        </Button>
      </Box>

      {/* RIGHT: BASIC INFORMATION FORM */}
      <Box sx={{ flex: "2 1 350px" }}>
        <Typography sx={{ fontSize: "1.3rem", fontWeight: 700, mb: 2 }}>
          Basic Information
        </Typography>

        <Grid container spacing={2} >
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={basicInfo.fullName}
              onChange={handleBasicChange}
            />
          </Grid>
             <Grid item xs={12}>
            <TextField
              fullWidth
          
              
              label="email"
              name="email"
              value={basicInfo.email}
             disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNo"
              value={basicInfo.phoneNo}
              onChange={handleBasicChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={basicInfo.location}
              onChange={handleBasicChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Portfolio Link"
              name="portfolioLink"
              value={basicInfo.portfolioLink}
              onChange={handleBasicChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="LinkedIn URL"
              name="linkedInUrl"
              value={basicInfo.linkedInUrl}
              onChange={handleBasicChange}
            />
          </Grid>
           
          <Grid item xs={12}>
            <TextField
              fullWidth
          
              
              label="Bio"
              name="bio"
              value={basicInfo.bio}
              onChange={handleBasicChange}
            />
          </Grid>
        </Grid>

        {/* SUBMIT BUTTON */}
        <Box mt={3} display="flex" justifyContent="end">
          {basicinfoIndex !==null?(<Button variant="contained" sx={{ px: 4, py: 1.2 }} onClick={handleSaveBasicChange}>
            Save Changes
          </Button>) :(<Button variant="contained" sx={{ px: 4, py: 1.2 }} onClick={handleSaveBasicInfo}>
            Submit
          </Button>)}
        </Box>
        {/* {basicInformation && (
  <Box
    sx={{
      mt: 4,
      p: 3,
      borderRadius: 3,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
    }}
  >
    <Typography sx={{ fontSize: "1.3rem", fontWeight: 700, mb: 2 }}>
      Submitted Information
    </Typography>

    <Typography><strong>Full Name:</strong> {basicInformation.fullName}</Typography>
    <Typography><strong>Email:</strong> {basicInformation.email}</Typography>
    <Typography><strong>Phone Number:</strong> {basicInformation.phoneNo}</Typography>
    <Typography><strong>Location:</strong> {basicInformation.location}</Typography>
    <Typography><strong>Portfolio:</strong> {basicInformation.portfolioLink}</Typography>
    <Typography><strong>LinkedIn:</strong> {basicInformation.linkedInUrl}</Typography>
    <Typography><strong>Bio:</strong> {basicInformation.bio}</Typography>

    {profilePicPreview && (
      <Avatar 
        src={profilePicPreview}
        sx={{ width: 100, height: 100, mt: 2, border: "2px solid #f89807" }}
      />
    )}
  </Box>
)} */}


      </Box>
    </Box>
  </>
);

const renderAcadmics = () => (
  <>
    <Grid container spacing={2}>

      {/* UNIVERSITY */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="University"
          name="university"
          value={academicInput.university}
          onChange={(e) =>
            setAcademicInput({ ...academicInput, university: e.target.value })
          }
        />
      </Grid>

      {/* DEGREE */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Degree"
          name="degree"
          value={academicInput.degree}
          onChange={(e) =>
            setAcademicInput({ ...academicInput, degree: e.target.value })
          }
        />
      </Grid>

      {/* DEPARTMENT */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Department"
          name="department"
          value={academicInput.fieldOfStudy}
         onChange={(e) =>
            setAcademicInput({ ...academicInput, department: e.target.value })
          }
        />
      </Grid>

      {/* ENROLLMENT YEAR */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Enrollment Year"
          type="date"
          name="startDate"
          value={academicInput.enrollmentYear}
          onChange={(e) =>
            setAcademicInput({ ...academicInput, enrollmentYear: e.target.value })
          }
        />
      </Grid>

      {/* GRADUATION YEAR */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Graduation Year"
          type="text"
          name="endDate"
          value={academicInput.graduationYear}
         onChange={(e) =>
            setAcademicInput({ ...academicInput, graduationYear: e.target.value })
          }
        />
      </Grid>

      {/* CGPA */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="CGPA"
          name="cgpa"
          type="number"
          inputProps={{ step: "0.01" }}
          value={academicInput.cgpa || ""}
         onChange={(e) =>
            setAcademicInput({ ...academicInput, cgpa: e.target.value })
          }
        />
      </Grid>

    </Grid>

    {/* ADD / SAVE BUTTON */}
    <Box mt={2}>
      {editAcademicIndex !== null ?(
       <Button variant="contained" onClick={handleSaveAcademicChanges}>Save Changes</Button>):(<Button variant="contained" onClick={handleAddAcademics}>Add Education</Button>)}
    </Box>

    {/* LIST OF ADDED ACADEMIC ENTRIES */}
    {academicInput.length > 0 &&
      academicInput.map((edu, index) => (
        <Card key={index} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">{edu.degree} — {edu.school}</Typography>

            <Typography>
              {edu.fieldOfStudy}
            </Typography>

            <Typography>
              {edu.startDate} - {edu.endDate}
            </Typography>

            <Typography>CGPA: {edu.cgpa}</Typography>

            <IconButton onClick={() => handleEditAcademics(index, edu._id)}>
              <EditIcon />
            </IconButton>

            <IconButton onClick={() => handleRemoveAcademics(index, edu._id)}>
              <DeleteOutlineIcon color="error" />
            </IconButton>
          </CardContent>
        </Card>
      ))}
  </>
);


  const renderLanguages = () => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Language"
            value={languageInput.name}
            onChange={(e) =>
              setLanguageInput({ ...languageInput, name: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Proficiency"
            value={languageInput.proficiency}
            onChange={(e) =>
              setLanguageInput({
                ...languageInput,
                proficiency: e.target.value,
              })
            }
          >
            {["Beginner", "Intermediate", "Advanced", "Fluent", "Native"].map(
              (item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              )
            )}
          </TextField>
        </Grid>
      </Grid>

      <Box mt={2}>
        {editLangIndex !== null ?(<Button variant="contained" onClick={handleSaveLanguageChanges}>Save Changes</Button>):(<Button variant="contained" onClick={handleAddLanguage}> add Language</Button>)}
      </Box>

      {languages.length > 0 &&
        languages.map((lang, index) => (
          <Card key={index} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6">{lang.name}</Typography>
              <Typography>{lang.proficiency}</Typography>

              <IconButton onClick={() => handleEditLanguage(index, lang._id)}>
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => handleRemoveLanguage(lang._id)}>
                <DeleteOutlineIcon color="error" />
              </IconButton>
            </CardContent>
          </Card>
        ))}
    </>
  );
const renderAchievements = () => (
  <>
    <Grid container spacing={2}>

      {/* ACHIEVEMENT / CERTIFICATE TITLE */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Achievement / Certificate Title"
          value={achievementInput.title}
          onChange={(e) =>
            setAchievementInput({
              ...achievementInput,
              title: e.target.value,
            })
          }
        />
      </Grid>

      {/* ORGANIZATION */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Issuing Organization"
          value={achievementInput.organization}
          onChange={(e) =>
            setAchievementInput({
              ...achievementInput,
              organization: e.target.value,
            })
          }
        />
      </Grid>

      {/* ISSUE DATE */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Issue Date"
          InputLabelProps={{ shrink: true }}
          value={achievementInput.issueDate}
          onChange={(e) =>
            setAchievementInput({
              ...achievementInput,
              issueDate: e.target.value,
            })
          }
        />
      </Grid>

      {/* CERTIFICATE URL */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Certificate URL (Optional)"
          value={achievementInput.certificateUrl}
          onChange={(e) =>
            setAchievementInput({
              ...achievementInput,
              certificateUrl: e.target.value,
            })
          }
        />
      </Grid>

      {/* DESCRIPTION */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          
          value={achievementInput.description}
          onChange={(e) =>
            setAchievementInput({
              ...achievementInput,
              description: e.target.value,
            })
          }
        />
      </Grid>

    </Grid>

    {/* ADD / SAVE BUTTON */}
    <Box mt={2}>
      {editAchIndex !== null ?(<Button variant="contained" onClick={handleSaveAchievementChanges}> 
        Save Changes
      </Button>):(<Button variant="contained" onClick={handleAddAchievements}> Add Achievement</Button>)}
    </Box>

    {/* ACHIEVEMENTS LIST */}
    {achievements.length > 0 &&
      achievements.map((ach, index) => (
        <Card key={index} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {ach.title}
            </Typography>

            <Typography sx={{ fontSize: "0.9rem", color: "#555" }}>
              {ach.organization} — {ach.issueDate}
            </Typography>

            {ach.certificateUrl && (
              <Typography
                sx={{
                  mt: 1,
                  wordBreak: "break-word",
                  color: "#0077b5",
                  cursor: "pointer",
                }}
                component="a"
                target="_blank"
                href={ach.certificateUrl}
              >
                View Certificate
              </Typography>
            )}

            {ach.description && (
              <Typography sx={{ mt: 1, color: "#444" }}>
                {ach.description}
              </Typography>
            )}

            <Box mt={1}>
              <IconButton onClick={() => handleEditAchievement(index, ach._id)}>
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => handleRemoveAchievement(ach._id)}>
                <DeleteOutlineIcon color="error" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
  </>
);

const renderAlumniInfo = () => (
  <>
    <Grid container spacing={2}>

      

      {/* COMPANY NAME */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Company Name"
          name="company"
          value={alumniInput.company}
          onChange={(e) =>
            setAlumniInput({ ...alumniInput, company: e.target.value })
          }
        />
      </Grid>

      {/* POSITION */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Position / Role"
          name="position"
          value={alumniInput.position}
          onChange={(e) =>
            setAlumniInput({ ...alumniInput, position: e.target.value })
          }
        />
      </Grid>

      {/* EXPERIENCE IN YEARS */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Experience (Years)"
          type="number"
          name="experience"
          value={alumniInput.experience}
          onChange={(e) =>
            setAlumniInput({ ...alumniInput, experience: e.target.value })
          }
          inputProps={{ min: 0, step: "0.1" }}
        />
      </Grid>

      {/* STARTING DATE */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Starting Date"
          InputLabelProps={{ shrink: true }}
          name="startDate"
          value={alumniInput.startDate}
          onChange={(e) =>
            setAlumniInput({ ...alumniInput, startDate: e.target.value })
          }
        />
      </Grid>

      {/* ADDITIONAL INFO */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Additional Info (Optional)"
          name="additionalInfo"
          
          value={alumniInput.additionalInfo}
          onChange={(e) =>
            setAlumniInput({
              ...alumniInput,
              additionalInfo: e.target.value,
            })
          }
        />
      </Grid>

    </Grid>

    {/* SUBMIT BUTTON */}
    <Box mt={2}>
      {editAlumniIndex!== null ?(<Button variant="contained" onClick={handleSaveAlumniChanges}>Save Changes</Button>):(<Button variant="contained" onClick={handleAddAlumniInfo}>add Alumni Information</Button>)}
    </Box>

    {/* LIST OF ADDED ALUMNI INFO */}
    {alumniInfo.length > 0 &&
      alumniInfo.map((info, index) => (
        <Card key={index} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {info.jobTitle} — {info.company}
            </Typography>

            <Typography>
              Position: {info.position}
            </Typography>

            <Typography>
              Experience: {info.experience} years
            </Typography>

            <Typography>
              Started: {info.startDate}
            </Typography>

            {info.additionalInfo && (
              <Typography sx={{ mt: 1, color: "#444" }}>
                {info.additionalInfo}
              </Typography>
            )}

            <Box mt={1}>
              <IconButton
                onClick={() => handleEditAlumniInfo(index, info._id)}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                onClick={() => handleRemoveAlumniInfo(info._id)}
              >
                <DeleteOutlineIcon color="error" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
  </>
);


  return (
   <ThemeProvider theme={localTheme}>
     <Box display="flex" p={2} >

      {/* ---------------- SIDEBAR ---------------- */}
      <Box width="250px" mr={4}>

        <Typography variant="h6" mb={1}>
          Profile Sections
        </Typography>

        <List>
          {sections.map((sec) => (
            <ListItem disablePadding key={sec.id}>
              <ListItemButton
                selected={activeSection === sec.id}
                onClick={() => setActiveSection(sec.id)}
              >
                <ListItemText primary={sec.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => navigate("/profile")}
        >
          Go Back
        </Button>
      </Box>

      {/* ---------------- RIGHT FORM AREA ---------------- */}
      <Box flexGrow={1}>
        <Typography variant="h5" mb={2}>
          {sections.find((s) => s.id === activeSection)?.name}
        </Typography>

        {activeSection === "basic" && renderBasicInfo()}
        {activeSection === "language" && renderLanguages()}
         {activeSection === "Acadmic" && renderAcadmics()}
         {activeSection === "acheivements" && renderAchievements()}
         {activeSection==="alumniInfo" && renderAlumniInfo()}
        {/* You can add the rest sections exactly like above */}

      </Box>
    </Box>
   </ThemeProvider>
  );
};

export default AlumniProfile;
