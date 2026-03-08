import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Rabbit } from 'lucide-react';
const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const { register, login } = useAuth();
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
  const [showPassword, setShowPassword] = useState(false);

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
        toast.success("Registration Successfull.", {
          duration: 1000,
          position: "top-center"
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

      // console.log(result.success);

      if (result.success) {
        toast.success("Login  Successfull.", {
          duration: 1000,
          position: "top-center"
        })

        navigate("/");
      } else {
        setError(result.error || "Login failed");
        toast("Login Failed.")
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute rounded-full bg-primary-foreground" style={{ width: "58.8463px", height: "58.6561px", top: "35.8427%", left: "84.3325%", opacity: 0.104245 }}></div>
          <div className="absolute rounded-full bg-primary-foreground" style={{ width: "40.5633px", height: "86.5937px", top: "75.2624%", left: "25.1673%", opacity: 0.16292 }}></div>
          <div className="absolute rounded-full bg-primary-foreground" style={{ width: "98.6424px", height: "112.776px", top: "3.76499%", left: "24.3077%", opacity: 0.292963 }}></div>
          <div className="absolute rounded-full bg-primary-foreground" style={{ width: "79.7811px", height: "110.481px", top: "78.7863%", left: "66.9378%", opacity: 0.15291 }}></div>
          <div className="absolute rounded-full bg-primary-foreground" style={{ width: "52.8039px", height: "118.347px", top: "44.7889%", left: "94.875%", opacity: 0.193645 }}></div>
          <div className="absolute rounded-full bg-primary-foreground" style={{ width: "51.9259px", height: "85.1889px", top: "58.7194%", left: "3.12173%", opacity: 0.245784 }}></div>
        </div>
        <div className="relative text-center text-primary-foreground max-w-md">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bird h-16 w-16 mx-auto mb-6"><path d="M16 7h.01"></path><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"></path><path d="m20 7 2 .5-2 .5"></path><path d="M10 18v3"></path><path d="M14 17.75V21"></path><path d="M7 18a6 6 0 0 0 3.84-10.61"></path></svg> */}
          <div className=" w-full flex justify-center items-center ">
            <div>
              <Rabbit className="lucide lucide-bird h-16 w-16 mx-auto mb-6" />
            </div>
            <div>            <h2 className="text-3xl font-display font-semibold mb-4">Welcome Back!</h2>
              <p className="text-primary-foreground/80 leading-relaxed">Join our network to access your dashboard, connect with peers, and share your skills.</p></div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md">
          <a className="flex items-center justify-center gap-2 font-display text-lg font-bold text-foreground mb-8 lg:hidden" href="/">
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bird h-6 w-6 text-primary"><path d="M16 7h.01"></path><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"></path><path d="m20 7 2 .5-2 .5"></path><path d="M10 18v3"></path><path d="M14 17.75V21"></path><path d="M7 18a6 6 0 0 0 3.84-10.61"></path></svg> */}

            <Rabbit className="lucide lucide-bird h-6 w-6 text-primary" />
          </a>
          <h1 className="text-xl font-display font-normal text-center text-foreground mb-2">{isSignup ? "Create an account" : "Sign in to your account"}</h1>
          <p className="text-sm text-center text-muted-foreground mb-8">{isSignup ? "Enter your details to register" : "Enter your credentials below"}</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isSignup && (
              <div>
                <label className="text-sm font-normal leading-none" htmlFor="fullName">Full Name</label>
                <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1.5" id="fullName" name="fullName" placeholder="John Doe" required value={registerData.fullName} onChange={handleRegisterChange} />
              </div>
            )}

            <div>
              <label className="text-sm  font-normal leading-none" htmlFor="email">Email</label>
              <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1.5" id="email" name="email" placeholder="you@example.com" required value={isSignup ? registerData.email : loginData.email} onChange={isSignup ? handleRegisterChange : handleLoginChange} />
            </div>

            <div>
              <label className="text-sm font-normal leading-none" htmlFor="password">Password</label>
              <div className="relative mt-1.5">
                <input type={showPassword ? "text" : "password"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" id="password" name="password" placeholder="••••••••" required value={isSignup ? registerData.password : loginData.password} onChange={isSignup ? handleRegisterChange : handleLoginChange} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-4 w-4">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="text-sm font-normal leading-none" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative mt-1.5">
                  <input type={showPassword ? "text" : "password"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required value={registerData.confirmPassword} onChange={handleRegisterChange} />
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm bg-primary hover:bg-primary/90 px-4 py-2 w-full text-primary-foreground h-11 rounded-xl font-semibold transition-colors mt-2" type="submit" disabled={loading}>
              {loading ? (isSignup ? "Signing up..." : "Signing in...") : (isSignup ? "Sign Up" : "Sign In")}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"} <button type="button" onClick={toggleMode} className="text-primary font-medium hover:underline">{isSignup ? "Sign in" : "Sign up"}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
