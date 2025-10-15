import React, { useState } from "react";
import "../App.css"; // Import your CSS

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleToggle = () => {
    setIsSignup(!isSignup);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      console.log("Signup form submitted");
      // handle signup logic here
    } else {
      console.log("Login form submitted");
      // handle login logic here
    }
    localStorage.setItem("token", "dummy_token");
     window.location.href = "/"; 
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input type="text" placeholder="Full Name" required />
          )}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {isSignup && (
            <input type="password" placeholder="Confirm Password" required />
          )}

          <button type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={handleToggle}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
