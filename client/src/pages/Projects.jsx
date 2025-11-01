import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function Projects() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    link: "",
    startDate: null,
    endDate: null,
    photos: [],
  });

  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSubmit = () => {
    if (!form.title || !form.description) {
      alert("Please fill in all required fields");
      return;
    }
    setProjects([...projects, { ...form, photos: [...form.photos] }]);
    setForm({
      title: "",
      description: "",
      technologies: "",
      link: "",
      startDate: null,
      endDate: null,
      photos: [],
    });
    console.log(form);
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          p: 4,
          maxWidth: "1000px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            bgcolor: "rgba(255, 255, 255, 0.75)",
            boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0px 12px 40px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            align="center"
            sx={{ mb: 2 }}
          >
            Add New Project
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Project Title"
              fullWidth
              size="small"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Project Description"
              multiline
              rows={2}
              fullWidth
              size="small"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Technologies (comma-separated)"
              fullWidth
              size="small"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            />
            <TextField
              label="Project Link"
              fullWidth
              size="small"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <DatePicker
                label="Start Date"
                value={form.startDate}
                onChange={(newValue) => setForm({ ...form, startDate: newValue })}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              <DatePicker
                label="End Date"
                value={form.endDate}
                onChange={(newValue) => setForm({ ...form, endDate: newValue })}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{ mt: 1 }}
            >
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  size="small"
                  component="span"
                  startIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 20h14v-2H5v2zm7-9v6h2v-6h3l-4-4-4 4h3z" />
                    </svg>
                  }
                  sx={{
                    px: 2,
                    py: 0.6,
                    fontSize: "0.85rem",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    color: "primary.main",
                    borderColor: "primary.main",
                    bgcolor: "rgba(25,118,210,0.04)",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "#fff",
                      borderColor: "primary.main",
                    },
                    cursor: "pointer",
                  }}
                >
                  Upload Photos
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, photos: Array.from(e.target.files) })}
                />
              </label>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    px: 2,
                    py: 0.6,
                    fontSize: "0.85rem",
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                  onClick={() =>
                    setForm({
                      title: "",
                      description: "",
                      technologies: "",
                      link: "",
                      startDate: null,
                      endDate: null,
                      photos: [],
                    })
                  }
                >
                  Clear
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    px: 2.5,
                    py: 0.6,
                    fontSize: "0.85rem",
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                  onClick={handleSubmit}
                >
                  Save Project
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {projects.length > 0 && (
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              align="center"
              mb={3}
            >
              Your Projects
            </Typography>

            <Stack spacing={3}>
              {projects.map((proj, index) => (
                <Paper
                  key={index}
                  onClick={() => handleCardClick(proj)}
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    p: 3,
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      color: "white",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {proj.title}
                    </Typography>
                    {(proj.startDate || proj.endDate) && (
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        📅{" "}
                        {proj.startDate
                          ? dayjs(proj.startDate).format("MMM YYYY")
                          : "—"}{" "}
                        –{" "}
                        {proj.endDate
                          ? dayjs(proj.endDate).format("MMM YYYY")
                          : "—"}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {proj.description.length > 180
                      ? proj.description.slice(0, 180) + "..."
                      : proj.description}
                  </Typography>

                  {proj.technologies && (
                    <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
                      {proj.technologies.split(",").map((tech, i) => (
                        <Chip
                          key={i}
                          label={tech.trim()}
                          color="primary"
                          size="small"
                          sx={{
                            borderRadius: 1,
                            fontSize: "0.75rem",
                          }}
                        />
                      ))}
                    </Stack>
                  )}

                  {proj.link && (
                    <MuiLink
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="primary"
                      fontWeight="medium"
                    >
                      View Project →
                    </MuiLink>
                  )}
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Project Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedProject && (
            <>
              <DialogTitle sx={{ fontWeight: "bold" }}>
                {selectedProject.title}
              </DialogTitle>
              <Divider />
              <DialogContent dividers>
                <Typography variant="body1" mb={2}>
                  {selectedProject.description}
                </Typography>

                {selectedProject.technologies && (
                  <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
                    {selectedProject.technologies
                      .split(",")
                      .map((tech, i) => (
                        <Chip
                          key={i}
                          label={tech.trim()}
                          color="primary"
                          size="small"
                        />
                      ))}
                  </Stack>
                )}

                {(selectedProject.startDate || selectedProject.endDate) && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    📅{" "}
                    {selectedProject.startDate
                      ? dayjs(selectedProject.startDate).format("MMM YYYY")
                      : "—"}{" "}
                    –{" "}
                    {selectedProject.endDate
                      ? dayjs(selectedProject.endDate).format("MMM YYYY")
                      : "—"}
                  </Typography>
                )}

                {selectedProject.photos.length > 0 && (
                  <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
                    {selectedProject.photos.map((file, i) => (
                      <Box
                        key={i}
                        component="img"
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        sx={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 2,
                          boxShadow: 1,
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </DialogContent>
              <DialogActions>
                {selectedProject.link && (
                  <MuiLink
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Visit Project
                  </MuiLink>
                )}
                <Button onClick={() => setOpenDialog(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
