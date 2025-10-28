import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  Paper,
  Stack,
  LinearProgress,
  Grid,
} from "@mui/material";

export default function CompleteProfile() {
  const [step, setStep] = useState("personal");
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    bio: "",
    location: "",
    photo: null,
    languages: [],
    education: [],
    experience: [],
    internships: [],
    projects: [],
    skills: [],
    current: { company: "", title: "", start: "", type: "On-site" },
    contact: { email: "", phone: "", links: "" },
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    updateProgress({ ...form, [name]: value });
  };

  const updateProgress = data => {
    let score = 0;
    if (data.fullName) score += 8;
    if (data.headline) score += 6;
    if (data.bio) score += 6;
    if (data.location) score += 6;
    if (data.photo) score += 5;
    if (data.languages.length) score += 10;
    if (data.education.length) score += 10;
    if (data.experience.length) score += 15;
    if (data.internships.length) score += 5;
    if (data.projects.length) score += 10;
    if (data.skills.length) score += 10;
    if (data.current.company) score += 6;
    if (data.contact.email) score += 4;
    if (score > 100) score = 100;
    setProgress(score);
  };

  const addItem = (key, item) => {
    const newForm = { ...form, [key]: [...form[key], item] };
    setForm(newForm);
    updateProgress(newForm);
  };

  const removeItem = (key, index) => {
    const updated = form[key].filter((_, i) => i !== index);
    const newForm = { ...form, [key]: updated };
    setForm(newForm);
    updateProgress(newForm);
  };

  const sections = [
    "personal",
    "languages",
    "education",
    "experience",
    "internships",
    "projects",
    "skills",
    "current",
    "contact",
  ];

  const renderSection = () => {
    switch (step) {
      case "personal":
        return (
          <Stack spacing={3} alignItems="center" width="100%">
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Headline"
              name="headline"
              value={form.headline}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Short Bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />

            <Button variant="outlined" component="label">
              Upload Photo
              <input
                hidden
                type="file"
                onChange={e => {
                  const f = e.target.files[0];
                  const newForm = { ...form, photo: f ? f.name : null };
                  setForm(newForm);
                  updateProgress(newForm);
                }}
              />
            </Button>

            {form.photo && (
              <Typography variant="body2" color="text.secondary">
                Uploaded: {form.photo}
              </Typography>
            )}
          </Stack>
        );

      case "languages":
        return (
          <Stack spacing={3} alignItems="center" width="100%">
            <TextField id="langName" label="Language" sx={{ width: "60%" }} />
            <Select
              id="langLevel"
              defaultValue="Beginner"
              sx={{ width: "60%" }}
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Fluent">Fluent</MenuItem>
              <MenuItem value="Native">Native</MenuItem>
            </Select>
            <Button
              variant="contained"
              onClick={() => {
                const name = document.getElementById("langName").value;
                const level = document.getElementById("langLevel").value;
                if (name) addItem("languages", { name, level });
                document.getElementById("langName").value = "";
              }}
            >
              Add
            </Button>

            <Stack spacing={1} mt={2} width="60%">
              {form.languages.map((l, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  variant="outlined"
                >
                  <Typography>
                    {l.name} — {l.level}
                  </Typography>
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => removeItem("languages", i)}
                  >
                    ✕
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Stack>
        );

      case "education":
        return (
          <Stack spacing={3} alignItems="center" width="100%">
            <TextField
              id="eduTitle"
              label="Degree / Course"
              sx={{ width: "60%" }}
            />
            <TextField id="eduInst" label="Institution" sx={{ width: "60%" }} />
            <Button
              variant="contained"
              onClick={() => {
                const title = document.getElementById("eduTitle").value;
                const inst = document.getElementById("eduInst").value;
                if (title && inst) addItem("education", { title, inst });
                document.getElementById("eduTitle").value = "";
                document.getElementById("eduInst").value = "";
              }}
            >
              Add
            </Button>

            <Stack spacing={1} mt={2} width="60%">
              {form.education.map((e, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  variant="outlined"
                >
                  <Typography>
                    {e.title} — {e.inst}
                  </Typography>
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => removeItem("education", i)}
                  >
                    ✕
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Stack>
        );

      case "skills":
        return (
          <Stack spacing={3} alignItems="center" width="100%">
            <Stack direction="row" spacing={2} sx={{ width: "60%" }}>
              <TextField id="skillName" label="Skill Name" fullWidth />
              <Select
                id="skillLevel"
                defaultValue="Beginner"
                sx={{ width: 150 }}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
              <Button
                variant="contained"
                onClick={() => {
                  const name = document.getElementById("skillName").value;
                  const level = document.getElementById("skillLevel").value;
                  if (name) addItem("skills", { name, level });
                  document.getElementById("skillName").value = "";
                }}
              >
                Add
              </Button>
            </Stack>

            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1.5}
              mt={2}
              sx={{ width: "60%" }}
            >
              {form.skills.map((s, i) => (
                <Paper
                  key={i}
                  variant="outlined"
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2">
                    {s.name} ({s.level})
                  </Typography>
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => removeItem("skills", i)}
                  >
                    ✕
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Stack>
        );

      default:
        return <Typography align="center">Section coming soon...</Typography>;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: "900px",
        mx: "auto",
        my: 4,
        p: 4,
        borderRadius: 3,
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h6" fontWeight="600">
            Complete your profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in all sections to make your profile stand out.
          </Typography>
        </Box>

        <Box sx={{ width: 200 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#1976d2",
              },
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            align="right"
            sx={{ mt: 0.5 }}
          >
            {progress}% complete
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3} sx={{ minHeight: "60vh" }}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Stack spacing={1}>
            {sections.map(s => (
              <Box
                key={s}
                onClick={() => setStep(s)}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  cursor: "pointer",
                  border: step === s ? "2px solid #1976d2" : "1px solid #ddd",
                  bgcolor: step === s ? "action.hover" : "transparent",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Typography variant="body1">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Main Section */}
        <Grid item xs={12} md={9}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              bgcolor: "grey.50",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center", // horizontally centered
                alignItems: "flex-start", // vertical: top
              }}
            >
              <Box sx={{ width: "80%", maxWidth: 600 }}>{renderSection()}</Box>
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
              <Button
                variant="outlined"
                onClick={() => alert(JSON.stringify(form, null, 2))}
              >
                Preview JSON
              </Button>
              <Button variant="contained" color="primary">
                Save Profile
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}