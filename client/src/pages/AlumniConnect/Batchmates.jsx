import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Button,
    CircularProgress,
    Divider,
    Modal,
    Paper,
    IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import alumniDirectoryServices from "../../AlumniConnect/alumniServices/alumniDirectoryServices";
import { useAlumniAuth } from "../../AlumniConnect/alumniContext/AlumniAuthContext";
import toast from "react-hot-toast";

const Batchmates = () => {
    const navigate = useNavigate();
    const { getUserProfile } = useAlumniAuth();
    const [batchmateAlumni, setBatchmateAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userAcademics, setUserAcademics] = useState(null);
    const [selectedAlumnus, setSelectedAlumnus] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchBatchmates = async () => {
            setLoading(true);
            try {
                const userProfile = await getUserProfile();

                // Extract highest/most recent academics (assumes array exists)
                if (userProfile && userProfile.Academics && userProfile.Academics.length > 0) {
                    // Usually the first entry is the most recent
                    const academics = userProfile.Academics[0];
                    setUserAcademics(academics);

                    if (academics.degree && academics.university && academics.enrollmentYear) {
                        const batchmateResponse = await alumniDirectoryServices.searchAlumniBatchmates(
                            academics.degree,
                            academics.university,
                            academics.enrollmentYear
                        );

                        if (batchmateResponse.success) {
                            // Filter out the current user
                            setBatchmateAlumni(batchmateResponse.alumni.filter(a => a._id !== userProfile._id));
                        }
                    } else {
                        toast.error("Incomplete academic details. Please update your profile.");
                    }
                } else {
                    toast.error("Please add academic details to your profile first");
                }
            } catch (error) {
                toast.error("Failed to load batchmates");
            } finally {
                setLoading(false);
            }
        };

        fetchBatchmates();
    }, [getUserProfile]);

    const handleOpenModal = (alumnus) => {
        setSelectedAlumnus(alumnus);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedAlumnus(null);
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
                            sx={{ width: 80, height: 80, border: '4px solid white', boxShadow: 2, mb: 2, bgcolor: '#ddd' }}
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
                                {alumnus.Academics?.[0]?.degree || "No Degree Set"}
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
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <GroupIcon sx={{ mr: 1, color: '#f89807', fontSize: 32 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="800" color="#333">
                            Your Batchmates
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Class of {userAcademics?.enrollmentYear ? new Date(userAcademics.enrollmentYear).getFullYear() : 'Unknown'} • {userAcademics?.degree || 'Unknown'} • {userAcademics?.university || 'Unknown'}
                        </Typography>
                    </Box>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <>
                        {batchmateAlumni.length > 0 ? (
                            <Grid container spacing={3}>
                                {batchmateAlumni.map(alumnus => renderAlumniCard(alumnus))}
                            </Grid>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 3 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No batchmates found for your specific academic profile.
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    They might have registered with slightly different details or haven't joined yet.
                                </Typography>
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
                    sx={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', borderRadius: 3, position: 'relative', outline: 'none' }}
                >
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
                        <CloseIcon />
                    </IconButton>

                    {selectedAlumnus && (
                        <Box>
                            <Box sx={{ height: 120, bgcolor: '#f89807' }} />
                            <Box sx={{ px: 4, pb: 4, mt: -6 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
                                    <Avatar sx={{ width: 100, height: 100, border: '4px solid white', boxShadow: 3, bgcolor: '#ddd', mr: 2 }}>
                                        {selectedAlumnus.basicInfo?.[0]?.fullName?.[0]?.toUpperCase() || '?'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">{selectedAlumnus.basicInfo?.[0]?.fullName}</Typography>
                                        <Typography color="text.secondary">{selectedAlumnus.alumniInfo?.[0]?.position} at {selectedAlumnus.alumniInfo?.[0]?.company}</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>BIO</Typography>
                                        <Typography variant="body2" color="text.secondary">{selectedAlumnus.basicInfo?.[0]?.bio || "No bio provided."}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>CONTACT INFO</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">{selectedAlumnus.email}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>SKILLS</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {(selectedAlumnus.skills || []).map((skill, idx) => (
                                                <Chip key={idx} label={skill.name} size="small" variant="outlined" />
                                            ))}
                                        </Box>
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

export default Batchmates;
