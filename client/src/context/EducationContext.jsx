import React from 'react'
import { createContext,useState,useContext,useEffect } from 'react'
import educationService from '../services/educationService'
import { useAuth } from './AuthContext'

const EducationContext=createContext()

 export const  EduContextProvider=({children})=>{
      // const [education,setEducation]=useState([])
     const { user, isAuthenticated } = useAuth(); 


    const getEducation=async ()=>{
        if(isAuthenticated && user?._id){
            const result=await educationService.getEducation(user._id)
            if(result.success){
                // setEducation(result.data)
            }
            
            
        }
        return result
    }

   const addEducation = async (educationData) => {
  if (isAuthenticated && user?._id) {
    try {
      const result = await educationService.addEducation(user._id, educationData);
      if (result.success) {
        // setEducation(result.data);
      } else {
        // Handle API error, such as showing an alert or storing error in local state
        console.error(result.error || "Failed to add education data.");
      }
      return result
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error.message);
    }
  }
};
const updateEducation = async (eduId, educationData) => {
  if (isAuthenticated && user?._id) {
    try {
      const result = await educationService.updateEducation( eduId, educationData);
      if (result.success) {
        // Update local education state array with the updated entry
        // // setEducation((prevEducation) =>
        //   prevEducation.map((edu) =>
        //     edu._id === eduId ? result.data : edu
        //   )
        // );
      } else {
        console.error(result.error || 'Failed to update education data.');
      }
      return result
    } catch (error) {
      console.error('Unexpected error:', error.message);
    }
  }
};
const deleteEducation = async (eduId) => {
  if (isAuthenticated && user?._id) {
    try {
      const result = await educationService.deleteEducation(user._id, eduId);
      if (result.success) {
        // setEducation((prevEducation) =>
        //   prevEducation.filter((edu) => edu._id !== eduId)
        // );
      } else {
        console.error(result.error || 'Failed to delete education data.');
      }
      return result
    } catch (error) {
      console.error('Unexpected error:', error.message);
    }
  }
};

return (
    <EducationContext.Provider value={{getEducation,addEducation,updateEducation,deleteEducation}}>
        {children}
    </EducationContext.Provider>
)

}
export const useEdu=()=> useContext(EducationContext)