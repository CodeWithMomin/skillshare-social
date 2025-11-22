import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, Chip, Container, Grid, IconButton, Paper, Tooltip, Typography, Divider,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import LanguageIcon from "@mui/icons-material/Language";



const COVER_GRADIENT = "linear-gradient(90deg, #fa709a 0%, #fee140 100%)";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {getUserProfile}=useAuth();
  const [preview, setPreview] = useState(null); 
  // Assume token is stored in localStorage after login
  const token = localStorage.getItem('authToken'); 
  const navigate=useNavigate()
 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
      const data = await getUserProfile(); // data is already JSON here
      // console.log(data);
      // console.log(token);
      
      setUser(data);
      
      
    } catch (error) {
      console.error(error.message);
       toast("error:", error);
    } finally {
      setLoading(false);
    }
    };
 fetchUserProfile();
    
  }, [token]);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Preview the selected image without API
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

   
  };

  ;
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        {/* <Typography variant="h6" align="center">Loading user data...</Typography> */}
       {/* { toast.loading('Loading user data...')} */}
      </Container>
    );
  }else{
    toast.dismiss()
}
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h6" align="center">
          User not found or please login
        </Typography>
      </Container>
    );
  }

  const isProfileComplete = () =>
    user.fullName &&
    user.email &&
    user.education?.length > 0 &&
    user.experience?.length > 0;

  const profileComplete = isProfileComplete();

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
      {/* Your full profile page JSX here, same as before */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', pb: 2 }}>
        {/* Cover/Banner */}
        <Box sx={{
          background: COVER_GRADIENT,
          height: 170,
          position: 'relative'
        }} />

        {/* Profile content overlay */}
        <Box sx={{
          position: 'relative',
          mt: -10,
          px: 4,
          display: 'flex',
          alignItems: 'center'
        }}>
            <input
            accept="image/*"
            id="upload-photo"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
                   <label htmlFor="upload-photo">
            <Avatar
              src={preview || user.photo || ""}
              alt={user.fullName}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid #fff",
                boxShadow: 2,
                position: "relative",
                zIndex: 2,
                cursor: "pointer", // 👈 makes it look clickable
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            />
          </label>

          <Box sx={{ ml: 4, flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {user.fullName || 'Name not set'}
            </Typography>
            <Typography variant="subtitle1" color="primary" mt={0.5}>
              {user.headline || 'No headline set'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {user.location || 'Location not set'}
            </Typography>
            <Box mt={1.5}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {user.bio || 'No bio available.'}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Tooltip title={profileComplete ? 'Edit Your Profile' : 'Complete Your Profile'}>
              <IconButton
                color={profileComplete ? 'success' : 'primary'}
                onClick={() => {
                  navigate('/complete-profile')
                }}
                sx={{
                  borderRadius: 2,
                  background: '#fff',
                  boxShadow: 1,
                  '&:hover': {
                    background: '#f5f5f5'
                  }
                }}
              >
                <AddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {/* Render other sections like languages, education, experience ... */}
         {/* Use a Stack to control the gap BETWEEN sections */}
        <Stack spacing={4} sx={{ px: 0, pt: 3, pb: 4 }}>
          {/* Languages Section */}
          <Box sx={{ px: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <LanguageIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Languages
              </Typography>
            </Stack>

            {user.languages?.length > 0 ? (
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {user.languages.map((lang, i) => (
                  <Chip
                    key={i}
                    label={`${lang.name} — ${lang.level}`}
                    sx={{
                      background: "#f8f9fa",
                      borderRadius: "10px",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                No languages added yet.
              </Typography>
            )}
          </Box>

          <Divider sx={{ mx: 4 }} />

          {/* Education Section */}
          <Box sx={{ px: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <SchoolIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Education
              </Typography>
            </Stack>

            {user.education?.length > 0 ? (
              <Stack spacing={2}>
                {user.education.map((edu, i) => (
                  <Paper
                    key={i}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: "#e0e0e0",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {edu.school}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.fieldOfStudy}
                    </Typography>
                    {edu.year && (
                      <Typography variant="body2" color="text.secondary">
                        Year: {edu.year}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                No education details available.
              </Typography>
            )}
          </Box>

          <Divider sx={{ mx: 4 }} />

          {/* Experience Section */}
          <Box sx={{ px: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <WorkIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Experience
              </Typography>
            </Stack>

            {user.experience?.length > 0 ? (
              <Stack spacing={2}>
                {user.experience.map((exp, i) => (
                  <Paper
                    key={i}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: "#e0e0e0",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {exp.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.company}
                    </Typography>
                    {exp.duration && (
                      <Typography variant="body2" color="text.secondary">
                        {exp.duration}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
              
            ) : (
              <Typography color="text.secondary">
                No experience details available.
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Profile;
