import React from "react";
import { createContext,useState,useEffect,useContext } from "react";
import alumniAuthServices from '../alumniServices/alumniAuthServices'
import authService from "../../services/authService";
import toast from "react-hot-toast";
const AlumniAuthContext=createContext()
export const AlumniAuthContextProvider=({children})=>{
    const [alumniUser,setAlumniUser]=useState(null)
    const [userType,setUserType]=useState("")
      const [isAlumniAuthenticated,setIsAlumniAuthenticated]=useState(false)
      useEffect(()=>{
        const storedUser=alumniAuthServices.getUser()
        if(storedUser){
            setAlumniUser(storedUser)
            setIsAlumniAuthenticated(true)
        }
      },[])

      const register=async (userData)=>{
        // console.log(userData);
        
        const result=await alumniAuthServices.register(userData)
        if(result.success){
            const userData=result.response.user;
          
            
            setUserType(userData.userType)
            setAlumniUser(userData)
            setIsAlumniAuthenticated(true)
             if (userData.alumni_token) {
                  localStorage.setItem('alumniAuth_Token', userData.token);
                }
            // console.log(isAlumniAuthenticated);
            
           
        }
        return result
      }
      const login=async (credentials)=>{
        const result=await alumniAuthServices.login(credentials)
        if(result.success){
            const userData=result.response.user
              console.log(userData.alumni_token);
              setUserType(userData.userType)
            setAlumniUser(userData)
            setIsAlumniAuthenticated(true)
             if (userData.alumni_token) {
                  localStorage.setItem('alumniAuth_Token', userData.alumni_token);
                }
        }
        return result
      }
      const logout=()=>{
        alumniAuthServices.logout();
        setAlumniUser(null)
        setIsAlumniAuthenticated(false)
    }
    const getUserProfile=async()=>{
      try {
        const result=await alumniAuthServices.getuserProfile()
        return result;
      } catch (error) {
        console.log(error);
        
      }
    }
      return (
        <AlumniAuthContext.Provider value={{userType,alumniUser,isAlumniAuthenticated,register,login,getUserProfile,logout}}>
            {children}
        </AlumniAuthContext.Provider>
      )
}
export const useAlumniAuth=()=>useContext(AlumniAuthContext)