import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Modal,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import alumniDirectoryServices from "../../AlumniConnect/alumniServices/alumniDirectoryServices";
import { useAlumniAuth } from "../../AlumniConnect/alumniContext/AlumniAuthContext";
import toast from "react-hot-toast";

const AlumniDirectory = () => {
  const { getUserProfile } = useAlumniAuth();
  const [alumniList, setAlumniList] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userCity, setUserCity] = useState("");
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpenModal = (alumnus) => {
    setSelectedAlumnus(alumnus);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedAlumnus(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all alumni
        const directoryResponse = await alumniDirectoryServices.getAllAlumni();
        if (directoryResponse.success) {
          setAlumniList(directoryResponse.alumni);
          setFilteredAlumni(directoryResponse.alumni);
        }
      } catch (error) {
        toast.error("Failed to load alumni directory");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getUserProfile]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = alumniList.filter((alumnus) => {
      const basic = alumnus.basicInfo?.[0] || {};
      const name = basic.fullName?.toLowerCase() || "";
      const city = basic.location?.toLowerCase() || "";
      const email = alumnus.email?.toLowerCase() || "";
      const skillsMatch = (alumnus.skills || []).some(s => s.name?.toLowerCase().includes(term));
      const academicMatch = (alumnus.Academics || []).some(a =>
        a.degree?.toLowerCase().includes(term) ||
        a.department?.toLowerCase().includes(term)
      );
      return name.includes(term) || city.includes(term) || email.includes(term) || skillsMatch || academicMatch;
    });
    setFilteredAlumni(filtered);
  };

  const renderAlumniCard = (alumnus) => {
    const basic = alumnus.basicInfo?.[0] || {};
    const info = alumnus.alumniInfo?.[0] || {};

    return (
      <Grid item xs={12} sm={6} md={4} key={alumnus._id}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            },
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ height: 80, bgcolor: '#f89807', opacity: 0.8 }} />
          <CardContent sx={{ pt: 0, mt: -5, display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                border: '4px solid white',
                boxShadow: 2,
                mb: 2,
                bgcolor: '#ddd'
              }}
            >
              {basic.fullName?.[0]?.toUpperCase() || '?'}
            </Avatar>

            <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
              {basic.fullName || "Unnamed Alumni"}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
              <WorkIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2" textAlign="center">
                {info.position ? `${info.position} at ${info.company}` : "Position not set"}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#f89807' }}>
              <SchoolIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2" fontWeight="600">
                {alumnus.Academics?.[1]?.degree || alumnus.Academics?.[0]?.degree || "No Degree Set"}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
              <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                {basic.location || "Location not set"}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mb: 2 }}>
              {(alumnus.skills || []).slice(0, 3).map((skill, idx) => (
                <Chip key={idx} label={skill.name} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
              ))}
              {(alumnus.skills || []).length > 3 && (
                <Chip label={`+${alumnus.skills.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
              )}
            </Box>

            <Box sx={{ mt: 'auto', width: '100%', display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2, flex: 1 }}
                onClick={() => handleOpenModal(alumnus)}
              >
                View
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: 2, flex: 1 }}
                onClick={() => navigate('/chat')}
              >
                Message
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7f9" }}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="800" gutterBottom color="#333">
            Alumni Directory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect with graduates and expand your professional network
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, city, or skills..."
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              maxWidth: 600,
              bgcolor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {/* All Alumni / Search Results */}
            <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
              {searchTerm ? `Search Results (${filteredAlumni.length})` : "Discover Alumni"}
            </Typography>

            {filteredAlumni.length > 0 ? (
              <Grid container spacing={3}>
                {filteredAlumni.map(alumnus => renderAlumniCard(alumnus))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h6" color="text.secondary">
                  No alumni found matching your criteria.
                </Typography>
                <Button variant="text" onClick={() => { setSearchTerm(""); setFilteredAlumni(alumniList); }}>
                  Clear all filters
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Profile Detail Modal */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Paper
          sx={{
            width: '100%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 3,
            position: 'relative',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>

          {selectedAlumnus && (
            <Box>
              {/* Header Image/Color */}
              <Box sx={{ height: 120, bgcolor: '#f89807' }} />

              <Box sx={{ px: 4, pb: 4, mt: -6 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      border: '4px solid white',
                      boxShadow: 3,
                      bgcolor: '#ddd',
                      mr: 2
                    }}
                  >
                    {selectedAlumnus.basicInfo?.[0]?.fullName?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedAlumnus.basicInfo?.[0]?.fullName}
                    </Typography>
                    <Typography color="text.secondary">
                      {selectedAlumnus.alumniInfo?.[0]?.position} at {selectedAlumnus.alumniInfo?.[0]?.company}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                      BIO
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAlumnus.basicInfo?.[0]?.bio || "No bio provided."}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                      CONTACT INFO
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedAlumnus.email}</Typography>
                    </Box>
                    {selectedAlumnus.basicInfo?.[0]?.phoneNo && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedAlumnus.basicInfo?.[0]?.phoneNo}</Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                      SOCIALS
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {selectedAlumnus.basicInfo?.[0]?.linkedInUrl && (
                        <IconButton
                          component="a"
                          href={selectedAlumnus.basicInfo[0].linkedInUrl}
                          target="_blank"
                          sx={{ color: '#0077b5' }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                      )}
                      {selectedAlumnus.basicInfo?.[0]?.portfolioLink && (
                        <IconButton
                          component="a"
                          href={selectedAlumnus.basicInfo[0].portfolioLink}
                          target="_blank"
                        >
                          <LanguageIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                      SKILLS
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(selectedAlumnus.skills || []).map((skill, idx) => (
                        <Chip key={idx} label={skill.name} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                      EDUCATION
                    </Typography>
                    {(selectedAlumnus.Academics || []).map((edu, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">{edu.degree} in {edu.department}</Typography>
                        <Typography variant="caption" color="text.secondary">{edu.university} | {edu.enrollmentYear} - {edu.graduationYear}</Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default AlumniDirectory;