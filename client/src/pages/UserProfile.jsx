import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { ArrowBack, BusinessCenter, School, LocationOn, PersonAdd, Check, Language, Assignment } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connect");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5000/api/users/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setProfileData(data.user);
          
          // Basic heuristic from currentUser's cached data, if available
          if (currentUser) {
            const isFriend = currentUser.friends?.some(f => f.userId === id);
            const isPending = currentUser.sentRequests?.some(r => r.userId === id || r._id === id); // id forms
            if (isFriend) setConnectionStatus("Connected");
            else if (isPending) setConnectionStatus("Pending");
          }
        } else {
          setError(data.message || "Failed to fetch user profile");
        }
      } catch (err) {
        setError("An error occurred while fetching the profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id, currentUser]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/users/${id}/connect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success("Connection request sent!");
        setConnectionStatus("Pending");
      } else {
        toast.error(data.message || "Failed to send request");
        if (data.message === "Already connected") setConnectionStatus("Connected");
        if (data.message === "Request already sent") setConnectionStatus("Pending");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsConnecting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress sx={{ color: "#ee9917" }} />
      </Box>
    );
  }

  if (error || !profileData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">{error || "User not found"}</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  // Helper to check connection status (Basic check, could be expanded)
  const isSelf = currentUser?._id === profileData._id;
  
  // Basic Info usually stored in an array
  const basicInfo = profileData.basicInfo && profileData.basicInfo.length > 0 ? profileData.basicInfo[0] : null;
  const displayLocation = basicInfo?.location || profileData.location;
  const displayBio = basicInfo?.bio || profileData.bio;
  const displayPhone = basicInfo?.phoneNo || profileData.phone;
  const displayPortfolio = basicInfo?.portfolioLink || profileData.contact?.portfolio;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 2, color: "#555" }}
      >
        Back
      </Button>

      <Card sx={{ borderRadius: 3, overflow: "hidden", mb: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
         {/* Cover Photo Area - Placeholder color since we don't have cover photos yet */}
         <Box sx={{ height: 120, bgcolor: "#ee9917", position: "relative" }}></Box>
         
         <CardContent sx={{ position: "relative", pt: 0, px: { xs: 2, sm: 4 }, pb: 4 }}>
           <Avatar
            src={profileData.profilePic || profileData.photo}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              mt: -6,
              mb: 2,
              bgcolor: "#f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          />
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {profileData.fullName}
              </Typography>
              
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                {profileData.headline || "No headline provided"}
              </Typography>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "text.secondary", mt: 1, flexWrap: "wrap" }}>
                {displayLocation && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">{displayLocation}</Typography>
                  </Box>
                )}
                {profileData.current && profileData.current.length > 0 && (
                   <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <BusinessCenter fontSize="small" />
                    <Typography variant="body2">{profileData.current[0].company}</Typography>
                  </Box>
                )}
                {profileData.education && profileData.education.length > 0 && (
                   <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <School fontSize="small" />
                    <Typography variant="body2">{profileData.education[0].school}</Typography>
                  </Box>
                )}
              </Box>
              
              {/* Extra Contact Info if available */}
              {(displayPhone || displayPortfolio) && (
                <Box sx={{ display: "flex", gap: 2, mt: 1.5, flexWrap: "wrap" }}>
                  {displayPhone && (
                    <Typography variant="body2" color="primary">
                      📞 {displayPhone}
                    </Typography>
                  )}
                  {displayPortfolio && (
                    <Typography variant="body2" color="primary" component="a" href={displayPortfolio.startsWith('http') ? displayPortfolio : `https://${displayPortfolio}`} target="_blank" sx={{ textDecoration: 'none', "&:hover": { textDecoration: 'underline' }}}>
                      🔗 Portfolio
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {!isSelf && (
              <Button
                variant={connectionStatus === "Connect" ? "contained" : "outlined"}
                startIcon={connectionStatus === "Connected" ? <Check /> : <PersonAdd />}
                onClick={handleConnect}
                disabled={connectionStatus !== "Connect" || isConnecting}
                sx={{
                  ...(connectionStatus === "Connect" && {
                    bgcolor: "#ee9917",
                    "&:hover": { bgcolor: "#d88a15" },
                    color: "white"
                  }),
                  borderRadius: 6,
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3
                }}
              >
                {isConnecting ? "Sending..." : connectionStatus}
              </Button>
            )}
          </Box>
         </CardContent>
      </Card>

      {/* About Section */}
      {displayBio && (
        <Card sx={{ borderRadius: 3, mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>About</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
              {displayBio}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {profileData.experience && profileData.experience.length > 0 && (
         <Card sx={{ borderRadius: 3, mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
         <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
           <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Experience</Typography>
           {profileData.experience.map((exp, index) => (
             <Box key={exp._id || index}>
               <Box sx={{ display: "flex", gap: 2, mb: index !== profileData.experience.length - 1 ? 3 : 0 }}>
                 <Avatar sx={{ bgcolor: "#f3f2ef", color: "#666" }}>
                   <BusinessCenter />
                 </Avatar>
                 <Box>
                   <Typography variant="subtitle1" fontWeight="bold">{exp.title}</Typography>
                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{exp.company} • {exp.employmentType}</Typography>
                   <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                     {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric'}) : ''} 
                     {exp.endDate ? ` - ${new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric'})}` : ' - Present'} 
                     {exp.location ? ` • ${exp.location}` : ''}
                   </Typography>
                   {exp.description && (
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                       {exp.description}
                     </Typography>
                   )}
                 </Box>
               </Box>
               {index !== profileData.experience.length - 1 && <Divider sx={{ my: 2 }} />}
             </Box>
           ))}
         </CardContent>
       </Card>
      )}

      {/* Education Section */}
      {profileData.education && profileData.education.length > 0 && (
         <Card sx={{ borderRadius: 3, mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
         <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
           <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Education</Typography>
           {profileData.education.map((edu, index) => (
             <Box key={edu._id || index}>
               <Box sx={{ display: "flex", gap: 2, mb: index !== profileData.education.length - 1 ? 3 : 0 }}>
                 <Avatar sx={{ bgcolor: "#f3f2ef", color: "#666" }}>
                   <School />
                 </Avatar>
                 <Box>
                   <Typography variant="subtitle1" fontWeight="bold">{edu.school}</Typography>
                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</Typography>
                   <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                     {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} 
                     {edu.endDate ? ` - ${new Date(edu.endDate).getFullYear()}` : ''}
                   </Typography>
                 </Box>
               </Box>
               {index !== profileData.education.length - 1 && <Divider sx={{ my: 2 }} />}
             </Box>
           ))}
         </CardContent>
       </Card>
      )}

      {/* Skills Section */}
      {profileData.skills && profileData.skills.length > 0 && (
         <Card sx={{ borderRadius: 3, mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
         <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
           <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Skills</Typography>
           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
             {profileData.skills.map((skill, index) => (
               <Chip 
                 key={skill._id || index} 
                 label={skill.name} 
                 variant="outlined"
                 sx={{ borderRadius: 1.5, fontWeight: 500 }}
               />
             ))}
           </Box>
         </CardContent>
       </Card>
      )}

      {/* Internships Section */}
      {profileData.internships && profileData.internships.length > 0 && (
         <Card sx={{ borderRadius: 3, mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
         <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
           <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Internships</Typography>
           {profileData.internships.map((intern, index) => (
             <Box key={intern._id || index}>
               <Box sx={{ display: "flex", gap: 2, mb: index !== profileData.internships.length - 1 ? 3 : 0 }}>
                 <Avatar sx={{ bgcolor: "#f3f2ef", color: "#666" }}>
                   <BusinessCenter />
                 </Avatar>
                 <Box>
                   <Typography variant="subtitle1" fontWeight="bold">{intern.role}</Typography>
                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{intern.company}</Typography>
                   <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                     {intern.startDate ? new Date(intern.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric'}) : ''} 
                     {intern.endDate ? ` - ${new Date(intern.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric'})}` : ' - Present'} 
                   </Typography>
                   {intern.description && (
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                       {intern.description}
                     </Typography>
                   )}
                 </Box>
               </Box>
               {index !== profileData.internships.length - 1 && <Divider sx={{ my: 2 }} />}
             </Box>
           ))}
         </CardContent>
       </Card>
      )}

      {/* Projects Section */}
      {profileData.projects && profileData.projects.length > 0 && (
         <Card sx={{ borderRadius: 3, mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
         <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
           <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Projects</Typography>
           {profileData.projects.map((proj, index) => (
             <Box key={proj._id || index}>
               <Box sx={{ display: "flex", gap: 2, mb: index !== profileData.projects.length - 1 ? 3 : 0 }}>
                 <Avatar sx={{ bgcolor: "#f3f2ef", color: "#666" }}>
                   <Assignment />
                 </Avatar>
                 <Box>
                   <Typography variant="subtitle1" fontWeight="bold">{proj.title}</Typography>
                   <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                     {proj.startDate ? new Date(proj.startDate).getFullYear() : ''} 
                     {proj.endDate ? ` - ${new Date(proj.endDate).getFullYear()}` : ''}
                   </Typography>
                   {proj.description && (
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                       {proj.description}
                     </Typography>
                   )}
                   {proj.link && (
                     <Button 
                       href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       size="small" 
                       variant="outlined" 
                       sx={{ mt: 1, textTransform: "none", borderRadius: 4 }}
                     >
                       View Project
                     </Button>
                   )}
                 </Box>
               </Box>
               {index !== profileData.projects.length - 1 && <Divider sx={{ my: 2 }} />}
             </Box>
           ))}
         </CardContent>
       </Card>
      )}

      {/* Languages Section */}
      {profileData.languages && profileData.languages.length > 0 && (
         <Card sx={{ borderRadius: 3, mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
         <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
           <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Languages</Typography>
           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
             {profileData.languages.map((lang, index) => (
               <Chip 
                 key={lang._id || index} 
                 icon={<Language fontSize="small" />}
                 label={`${lang.name} ${lang.proficiency ? `(${lang.proficiency})` : ''}`} 
                 variant="outlined"
                 sx={{ borderRadius: 1.5, fontWeight: 500 }}
               />
             ))}
           </Box>
         </CardContent>
       </Card>
      )}

    </Box>
  );
};

export default UserProfile;
