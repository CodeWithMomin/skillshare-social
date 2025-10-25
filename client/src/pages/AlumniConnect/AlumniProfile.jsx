import React, { useState } from 'react';
import { Box, Grid, Avatar, Typography, TextField, Button, IconButton } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom';
const AlumniProfile = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    userType: 'Alumni',
    email: '',
    graduationYear: '',
    department: '',
    company: '',
    jobTitle: '',
    location: '',
    bio: '',
    avatar: null,
  });
const [savedProfile, setSavedProfile] = useState({ ...profileData });
const navigate=useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const handleSave = () => {
  setSavedProfile({ ...profileData });
  console.log('Profile Data Saved:', profileData);
};


  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} columns={{ xs: 12, md: 12 }}>
        {/* Left Profile Card */}
        <Grid  size={{xs:12,md:4}}>
  <Box
    sx={{
      p: 3,
      boxShadow: 2,
      borderRadius: 2,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    }}
  >
    {/* Top Profile Info */}
    <Box>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          src={profileData.avatar || '/default-avatar.png'}
          sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-avatar"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-avatar">
          <IconButton
            color="primary"
            component="span"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#f89807',
              '&:hover': { backgroundColor: '#e67e00' },
              color: '#fff',
            }}
          >
            <UploadFileIcon />
          </IconButton>
        </label>
      </Box>

      <Typography variant="h6" fontWeight="bold">
        {savedProfile.fullName || 'Your Name'}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {savedProfile.userType}
      </Typography>
      <Typography variant="body2">
        Email: {savedProfile.email || 'example@email.com'}
      </Typography>
      <Typography variant="body2">
        Graduation Year: {savedProfile.graduationYear || '-'}
      </Typography>
      <Typography variant="body2">
        Department: {savedProfile.department || '-'}
      </Typography>
      <Typography variant="body2">
        Company: {savedProfile.jobTitle || '-'}
      </Typography>
      <Typography variant="body2">
        Location: {savedProfile.location || '-'}
      </Typography>
    </Box>

    {/* Bottom Icon Buttons: Settings & Logout */}
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
      <IconButton
        sx={{ color: '#f89807', border: '1px solid #f89807' }}
        onClick={() => console.log('Settings clicked')}
      >
        <SettingsIcon />
      </IconButton>
      <IconButton
        sx={{ color: '#f89807', border: '1px solid #f89807' }}
        onClick={() =>{
          localStorage.removeItem("alumni-token")
          navigate('/alumni-auth')
        }
        }
      >
        <LogoutIcon />
      </IconButton>
    </Box>
  </Box>
</Grid>

        {/* Right Profile Form */}
        <Grid size={{ xs: 12, md:8 }}>
          <Box
            sx={{
              p: 3,
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{color:"black"}} mb={2}>Complete Your Profile</Typography>
            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
              <Grid size={{ xs: 12}} >
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
             
              <Grid size={{ xs: 12, sm:6}}>
                <TextField
                  label="Graduation Year"
                  name="graduationYear"
                  value={profileData.graduationYear}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm:6 }}>
                <TextField
                  label="Department / Major"
                  name="department"
                  value={profileData.department}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm:6 }}>
                <TextField
                  label="Company / Job Title"
                  name="jobTitle"
                  value={profileData.jobTitle}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm:6 }}>
                <TextField
                  label="Location"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Bio / About Me"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" sx={{
                mt: 1,
             backgroundColor: '#f89807',
            '&:hover': { backgroundColor: '#e67e00' },
            color: '#fff',
            fontWeight: 'bold',
             }} onClick={handleSave}>
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlumniProfile;
