import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, Chip, Container, Grid, IconButton, Paper, Tooltip, Typography, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
const COVER_GRADIENT = "linear-gradient(90deg, #fa709a 0%, #fee140 100%)";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {getUserProfile}=useAuth();
  // Assume token is stored in localStorage after login
  const token = localStorage.getItem('authToken'); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
      const data = await getUserProfile(); // data is already JSON here
      // console.log(data);
      // console.log(token);
      console.log("Profile Data",data);
      
      setUser(data);
      
      
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
    };
 fetchUserProfile();
    
  }, [token]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h6" align="center">Loading user data...</Typography>
      </Container>
    );
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
          <Avatar
            src={user.photo || ''}
            alt={user.fullName}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid #fff',
              boxShadow: 2,
              position: 'relative',
              zIndex: 2,
            }}
          />
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
                  window.location.href = profileComplete ? '/edit-profile' : '/complete-profile';
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
      </Paper>
    </Container>
  );
};

export default Profile;
