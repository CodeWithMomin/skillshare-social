import React, { Children } from 'react'
import { createContext, useState, useEffect, useContext } from 'react'
import authService from '../services/authService'
import socket from '../socket'
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
          .then(res => res.json())
          .then(data => {
            if (!data.error) setGlobalUnreadCounts(data);
          })
          .catch(console.error);
      }
    }
  }, []);

  // ── Global socket connection: keep user registered as Online on the server
  // This must run whenever the user object is available (not just on /chat page)
  useEffect(() => {
    if (user && user._id) {
      // Set userId query before connecting
      socket.io.opts.query = { userId: user._id };
      if (!socket.connected) socket.connect();
      
      const handleNewMessage = (msg) => {
        // We only increment if we are not actively viewing this user's chat.
        // UserChat handles clearing it if actively viewed.
        setGlobalUnreadCounts(prev => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1
        }));
      };
      
      socket.on("newMessage", handleNewMessage);
      
      return () => {
        socket.off("newMessage", handleNewMessage);
        // Do NOT disconnect here — socket stays alive across page navigation
      }
    }
    return () => {};
  }, [user]);

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
    socket.disconnect(); // unregister from online list
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

