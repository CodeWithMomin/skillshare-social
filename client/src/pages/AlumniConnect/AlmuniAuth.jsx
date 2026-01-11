import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  MenuItem,
  duration,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAlumniAuth } from "../../AlumniConnect/alumniContext/AlumniAuthContext";

const AlumniAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const {register,login}=useAlumniAuth()
  const toggleForm = () => setIsSignUp(!isSignUp);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "", // Student / Alumni
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      console.log("Signing up with minimal data:", formData);
      const result=await register(formData)
      // console.log(result);
      if(result.success){
        toast.success(result.message,{
          duration:1000,
          position:"top-center"
        })
        navigate("/alumniconnect")
      }
      else{
        toast.error(result.error||"Error")
      }

     
    } else {
      console.log("Signing in with data:", formData);

      const result=await login(formData)
      // console.log(result);
      
      if(result.success){
         toast.success("Login  Successfull.",{
          duration:1000,
          position:"top-center"
        })
      navigate('/alumniconnect')
      } else{
        toast.error(result.error||"Error")
      }

    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
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

      {/* Auth Card */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Card
          sx={{
            width: 360,
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#e65100",
                textAlign: "center",
                mb: 2,
              }}
            >
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              {/* Email */}
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                size="small"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Password */}
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                size="small"
                value={formData.password}
                onChange={handleChange}
              />

              {/* User Type Dropdown */}
          {isSignUp && (
  <TextField
    select
    label="User Type"
    name="userType"
    value={formData.userType}
    onChange={handleChange}
    size="small"
    fullWidth
  >
    <MenuItem value="student">Student</MenuItem>
    <MenuItem value="alumni">Alumni</MenuItem>
  </TextField>
)}


              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
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

            {/* Social login for Sign In only */}
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

            {/* Toggle Sign In / Sign Up */}
            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
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
