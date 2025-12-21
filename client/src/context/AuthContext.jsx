import React, { Children } from 'react'
import { createContext,useState,useEffect,useContext } from 'react'
import authService from '../services/authService'
const AuthContext= createContext()

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const [isAuthenticated,setIsAuthenticated]=useState(false)

    useEffect(()=>{
            const storedUser=authService.getUser()
            if(storedUser){
                setUser(storedUser)
                setIsAuthenticated(true)
            }
    },[]);

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
            
            
  const getUserProfile=async ()=>{
              const res=await authService.getUserProfile()
              // console.log("User INfo",res);
              return res
            }
    const logout=()=>{
        authService.logout();
        setUser(null)
        setIsAuthenticated(false)
    }
    return (
        <AuthContext.Provider value={{user,isAuthenticated,register,login,logout,getUserProfile}}>
            {children}
        </AuthContext.Provider>
    )        
}
export const useAuth=()=> useContext(AuthContext)   //custom hook

