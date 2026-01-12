import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProfilePicture } from "../context/ProfilePictureContext";

// NEW ICONS
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";

const BRAND = "#ee9917";

const COVER_GRADIENT =
  "linear-gradient(135deg, #ee9917 0%, #f2b04a 100%)";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getUserProfile } = useAuth();
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { profilePic, uploadProfilePicture } = useProfilePicture();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setPreview(data.profilePic);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [token]);

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    const result = await uploadProfilePicture(file);

    result?.success
      ? toast.success("Profile picture updated!")
      : toast.error("Upload failed!");
  };

  if (loading) return <Container maxWidth="md" sx={{ mt: 4 }} />;
  if (!user)
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography align="center">User not found</Typography>
      </Container>
    );

  const profileComplete =
    user.fullName &&
    user.email &&
    user.education?.length > 0 &&
    user.experience?.length > 0;

  return (
    <Container maxWidth="md" sx={{
      mt: 6, mb: 10,
    }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        {/* COVER */}
        <Box sx={{
          background: COVER_GRADIENT,
          height: { xs: 120, sm: 190 },
        }} />

        {/* HEADER */}
        <Box
          sx={{
            mt: { xs: -9, sm: -11 },
            px: { xs: 2, sm: 4 },
            display: "flex",
            flexDirection: { xs: "row", sm: "row" },
            alignItems: { xs: "center", sm: "center" },
            gap: { xs: 2, sm: 4 },
            textAlign: { xs: "left", sm: "left" },
          }}
        >
          <input
            accept="image/*"
            id="upload-photo"
            type="file"
            hidden
            onChange={handleImageChange}
          />
          <label htmlFor="upload-photo">
            <Avatar
              src={`http://localhost:5173${profilePic}`}
              alt={user.fullName}
              sx={{
                width: { xs: 90, sm: 130 },
                height: { xs: 90, sm: 130 },
                border: "4px solid white",
                boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
          </label>

          <Box flex={1}>
            <Typography
              mt={{ xs: 1, sm: 1.2 }}
              mb={{ xs: 0, sm: 0 }}
              fontWeight={800}
              color="#fff"
              sx={{
                fontSize: { xs: "1.2rem", sm: "2.1rem" },
              }}
            >

              {user.fullName}
            </Typography>
            {user.basicInfo?.[0]?.portfolioLink && (

              <Typography
                variant="subtitle1"
                sx={{ mb: 0, mt: { xs: 0, sm: 0 }, fontWeight: 600, fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                <a
                  href={user.basicInfo[0].portfolioLink}
                  style={{
                    color: "#fff",
                    textDecoration: "none"
                  }}
                  target="_blank"
                  rel="noopener noreferrer"

                >
                  Visit Portfolio
                  <LinkRoundedIcon sx={{ fontSize: 18, color: "#fff", }} />
                </a>
              </Typography>
            )}

            <Typography color="#000" fontWeight={600} sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, mt: { xs: 1.5, sm: 0 } }}>
              {user.basicInfo?.[0]?.location}
            </Typography>
            <Typography
              mt={0.5}
              fontWeight={600}
              whiteSpace="pre-line"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >

              {user.basicInfo?.[0]?.bio}
            </Typography>
          </Box>

          <Tooltip
            title={profileComplete ? "Edit Profile" : "Complete Profile"}
          >
            <IconButton
              onClick={() => navigate("/complete-profile")}
              sx={{
                bgcolor: "#fff",
                p: 1.2,
                borderRadius: 3,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                alignSelf: { xs: "auto", sm: "auto" },
                mt: { xs: 1, sm: 0 },
                "&:hover": { bgcolor: "#fff6e8" },
              }}
            >
              <EditRoundedIcon sx={{ color: BRAND }} fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* SECTIONS */}
        <Stack spacing={5} sx={{ pt: 4, pb: 5 }}>
          {/* LANGUAGES */}
          <Section title="Languages" icon={<LanguageRoundedIcon sx={{ color: BRAND }} />}>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {user.languages?.length > 0 ? (
                user.languages.map((lang, i) => (
                  <Chip
                    key={i}
                    label={`${lang.name} \u2022 ${lang.proficiency}`}
                    sx={{
                      background: "linear-gradient(135deg, #ee9917 0%, #f2b04a 100%)",
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  />
                ))
              ) : (
                <Typography color="text.secondary">
                  No languages added yet.
                </Typography>
              )}
            </Stack>
          </Section>

          <Divider />

          {/* EDUCATION */}
          <Section title="Education" icon={<SchoolRoundedIcon sx={{ color: BRAND }} />}>
            <Stack spacing={2}
            >
              {user.education.map((edu, i) => (
                <ModernPaper key={i}>
                  <Typography fontWeight={700}>{edu.school}</Typography>
                  <Typography color="text.secondary">
                    {edu.degree} • {edu.fieldOfStudy}
                  </Typography>
                  <Typography color="text.secondary">
                    Duration: {edu.startDate} - {edu.endDate}
                  </Typography>
                  <Typography color="text.secondary">
                    {edu.details}
                  </Typography>
                </ModernPaper>
              ))}
            </Stack>
          </Section>

          <Divider />

          {/* INTERNSHIP */}
          <Section title="Internship" icon={<BusinessCenterRoundedIcon sx={{ color: BRAND }} />}>
            <Stack spacing={2}>
              {user.internships.map((internship, i) => (
                <ModernPaper key={i}>
                  <Typography fontWeight={700}>
                    {internship.company} • ({internship.role}) {internship.employmentType}
                  </Typography>
                  <Typography color="text.secondary">
                    Start Date: {internship.startDate}
                  </Typography>
                  <Typography color="text.secondary">
                    End Date: {internship.endDate}
                  </Typography>
                  <Typography color="text.secondary">
                    {internship.description}
                  </Typography>
                </ModernPaper>
              ))}
            </Stack>
          </Section>

          <Divider />

          {/* EXPERIENCE */}
          <Section title="Experience" icon={<WorkHistoryRoundedIcon sx={{ color: BRAND }} />}>
            <Stack spacing={2}>
              {user.experience.map((exp, i) => (
                <ModernPaper key={i}>
                  <Typography fontWeight={700}>
                    {exp.company} • ({exp.title}) {exp.employmentType}
                  </Typography>
                  <Typography color="text.secondary">
                    Location: {exp.location}
                  </Typography>
                  <Typography color="text.secondary">
                    Start Date: {exp.startDate}
                  </Typography>
                  <Typography color="text.secondary">
                    End Date: {exp.endDate}
                  </Typography>
                  <Typography color="text.secondary">
                    {exp.description}
                  </Typography>
                </ModernPaper>
              ))}
            </Stack>
          </Section>

          <Divider />

          {/* SKILLS */}
          <Section title="Skills" icon={<PsychologyRoundedIcon sx={{ color: BRAND }} />}>
            <Grid container spacing={2}>
              {user.skills.map((skill, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <ModernPaper>
                    <Typography fontWeight={700}>{skill.name}</Typography>
                    <Typography color="text.secondary">
                      {skill.level}
                    </Typography>
                  </ModernPaper>
                </Grid>
              ))}
            </Grid>
          </Section>

          <Divider />

          {/* CURRENT */}
          <Section title="Current Position" icon={<BusinessCenterRoundedIcon sx={{ color: BRAND }} />}>
            <Stack spacing={2}>
              {user.current.map((current, i) => (
                <ModernPaper key={i}>
                  <Typography fontWeight={700}>
                    {current.company} • ({current.role}) {current.employmentType}
                  </Typography>
                  <Typography color="text.secondary">
                    Start Date: {current.startDate}
                  </Typography>
                  <Typography color="text.secondary">
                    {current.description}
                  </Typography>
                </ModernPaper>
              ))}
            </Stack>
          </Section>
        </Stack>
      </Paper>
    </Container >
  );
};

/* ---------- small UI helpers (STYLE ONLY) ---------- */

const Section = ({ title, icon, children }) => (
  <Box px={4}>
    <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
      {icon}
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
    </Stack>
    {children}
  </Box>
);

const ModernPaper = ({ children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 3,
      backgroundColor: "#fff",
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      transition: "0.25s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
      },
    }}
  >
    {children}
  </Paper>
);

export default Profile;
