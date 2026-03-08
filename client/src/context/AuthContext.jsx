import React from 'react'
import { createContext, useState, useEffect, useContext } from 'react'
import authService from '../services/authService'
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [globalUnreadCounts, setGlobalUnreadCounts] = useState({})

  const totalUnreadCount = Object.values(globalUnreadCounts).reduce((sum, count) => sum + count, 0);

  useEffect(() => {
    const storedUser = authService.getUser()
    if (storedUser) {
      setUser(storedUser)
      setIsAuthenticated(true)

      // Fetch initial unread counts
      const token = localStorage.getItem("authToken");
      if (token) {
        fetch("http://localhost:5000/api/messages/unread-counts", {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(async res => {
            if (!res.ok) throw new Error("Failed to fetch unread counts");
            return res.json();
          })
          .then(data => {
            if (data && !data.error && !data.message) setGlobalUnreadCounts(data);
          })
          .catch(err => {
            console.error("Unread counts fetch error:", err);
            // Optionally clear token if unauthorized
          });
      }
    }
  }, []);

  const register = async (userInfo) => {
    const res = await authService.register(userInfo);
    console.log("Register response: ", res);

    if (res.success) {
      const userData = res.response.user;  // extract user object
      setUser(userData);
      setIsAuthenticated(true);
      if (userData.token) {
        localStorage.setItem('authToken', userData.token);
      }
    }

    return res;
  };

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    //  console.log("Login response:", res);


    if (res.success) {
      const userData = res.response.user;  // extract user object
      setUser(userData);
      setIsAuthenticated(true);
      if (userData.token) {
        localStorage.setItem('authToken', userData.token);
      }
    }

    return res;
  };


  const getUserProfile = async () => {
    const res = await authService.getUserProfile()
    // console.log("User INfo",res);
    return res
  }

  const updateUser = (updatedFields) => {
    if (user) {
      const newUser = { ...user, ...updatedFields };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null)
    setIsAuthenticated(false)
  }
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      register,
      login,
      logout,
      updateUser,
      getUserProfile,
      globalUnreadCounts,
      setGlobalUnreadCounts,
      totalUnreadCount
    }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)   //custom hook

