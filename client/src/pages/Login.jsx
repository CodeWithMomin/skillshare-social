import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import toast from "react-hot-toast";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const { user,isAuthenticated,register,login,} = useAuth();
  const navigate = useNavigate();

  // Separate states for login and register forms
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setError("");
    setIsSignup((prev) => !prev);
  };

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (registerData.password !== registerData.confirmPassword) {
        setError("Passwords do not match");
         toast("Passwords Does Not Match");
        return;
      }
      setLoading(true);
      const { success, error } = await register(registerData);
      setLoading(false);
      console.log(success);
      
      if (success) {
        toast.success("Registration Successfull.",{
          duration:1000,
          position:"top-center"
        })
        navigate("/");
      } else {
        setError(error || "Registration failed");
         toast("Registration Failed.");
      }
    } else {
      setLoading(true);
      const result = await login(loginData);
      setLoading(false);
      
      console.log(result.success);
      toast.success("Login  Successfull.",{
          duration:1000,
          position:"top-center"
        })
      
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Login failed");
        toast("Login Failed.")
      }
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        margin: "auto",
        padding: 4,
        marginTop: 8,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {isSignup ? "Create Account" : "Welcome Back"}
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        {isSignup ? (
          <>
            <TextField
              label="Full Name"
              name="fullName"
              value={registerData.fullName}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
              type="email"
              required
            />
            <TextField
              label="Password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
              type="password"
              required
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
              type="password"
              required
            />
          </>
        ) : (
          <>
            <TextField
              label="Email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              fullWidth
              margin="normal"
              type="email"
              required
            />
            <TextField
              label="Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              fullWidth
              margin="normal"
              type="password"
              required
            />
          </>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
        </Button>
      </form>

      <Typography variant="body2" align="center">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link component="button" variant="body2" onClick={toggleMode} sx={{ cursor: "pointer" }}>
          {isSignup ? "Login" : "Sign Up"}
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
