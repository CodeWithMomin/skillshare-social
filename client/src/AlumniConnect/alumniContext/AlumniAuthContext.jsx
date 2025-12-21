import React from "react";
import { createContext,useState,useEffect,useContext } from "react";
import alumniAuthServices from '../alumniServices/alumniAuthServices'
import authService from "../../services/authService";
import toast from "react-hot-toast";
const AlumniAuthContext=createContext()
export const AlumniAuthContextProvider=({children})=>{
    const [alumniUser,setAlumniUser]=useState(null)
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
            setAlumniUser(userData)
            setIsAlumniAuthenticated(true)
            // console.log(isAlumniAuthenticated);
            
           
        }
        return result
      }
      const login=async (credentials)=>{
        const result=await alumniAuthServices.login(credentials)
        if(result.success){
            const userData=result.response.user
            setAlumniUser(userData)
            setIsAlumniAuthenticated(true)
        }
        return result
      }
      const logout=()=>{
        alumniAuthServices.logout();
        setAlumniUser(null)
        setIsAlumniAuthenticated(false)
    }
      return (
        <AlumniAuthContext.Provider value={{alumniUser,isAlumniAuthenticated,register,login,logout}}>
            {children}
        </AlumniAuthContext.Provider>
      )
}
export const useAlumniAuth=()=>useContext(AlumniAuthContext)