import React, { useState } from "react";
import "../App.css"; // Import your CSS

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [gender, setGender] = useState(""); // new state for gender

  const handleToggle = () => {
    setIsSignup(!isSignup);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      console.log("Signup form submitted", { gender });
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
          {isSignup && <input type="text" placeholder="Full Name" required />}

          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {isSignup && <input type="password" placeholder="Confirm Password" required />}

          {/* Gender selection */}
          {isSignup && (
            <div className="gender-selection">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Other
              </label>
            </div>
          )}

          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={handleToggle}>{isSignup ? "Login" : "Sign Up"}</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
