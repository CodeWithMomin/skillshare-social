import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AlumniAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setIsSignUp(!isSignUp);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    graduation_year: "",
    department: "",
    company: "",
    job: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // update only the changed field
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      console.log("Signing up with data:", formData);
      // localStorage.setItem("alumni-token", "dummy_signup_token");
    } else {
      console.log("Signing in with data:", formData);
      localStorage.setItem("alumni-token", "dummy_signin_token");
    }

    navigate("/alumniconnect");
  };

  return (
    <Box
      sx={{
        minHeight: "95vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#e65100",
          color: "white",
          textAlign: "center",
          py: 1.5,
          fontWeight: "bold",
          fontSize: 22,
          letterSpacing: 0.5,
        }}
      >
        IUST Alumni Association
      </Box>

      {/* Main Card */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: isSignUp ? 320 : 380,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            transition: "width 0.3s ease",
          }}
        >
          <CardContent sx={{ p: isSignUp ? 2.5 : 3.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#e65100",
                textAlign: "center",
                mb: 2,
              }}
            >
              {isSignUp ? "Create Alumni Account" : "Welcome Back Alumni"}
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}
            >
              {isSignUp && (
                <>
                  <TextField
                    label="Full Name"
                    name="fullname"
                    value={formData.fullname}
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={handleChange}
                  />
                  <TextField
                    label="Graduation Year"
                    name="graduation_year"
                    value={formData.graduation_year}
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={handleChange}
                  />
                  <TextField
                    label="Department / Major"
                    name="department"
                    value={formData.department}
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={handleChange}
                  />
                </>
              )}

              <TextField
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.password}
                onChange={handleChange}
              />

              {isSignUp && (
                <>
                  <TextField
                    label="Company / Organization"
                    name="company"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.company}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Job Title / Role"
                    name="job"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.job}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Location"
                    name="location"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1.2,
                  py: 0.9,
                  backgroundColor: "#e65100",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#bf4c00" },
                }}
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </Box>

            {!isSignUp && (
              <>
                <Divider sx={{ my: 2 }}>OR</Divider>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#1877f2",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#145db2" },
                    }}
                  >
                    Connect with Facebook
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#db4437",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#b93227" },
                    }}
                  >
                    Connect with Google
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#0a66c2",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#004182" },
                    }}
                  >
                    Connect with LinkedIn
                  </Button>
                </Box>
              </>
            )}

            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Typography
                component="span"
                sx={{
                  color: "#e65100",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={toggleForm}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Typography>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AlumniAuth;
