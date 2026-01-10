import React from "react";
import { createContext,useContext } from "react";
import alumniInfoServices from "../alumniServices/alumniInfoServices";
 const AlumniInfoContext=createContext()
 export const AlumniInfoContextProvider=({children})=>{
    const addAlumniInfo=async(alumniData)=>{
        try {
            const result=await alumniInfoServices.addAlumniInfo(alumniData)
            if(result)
                return result
        } catch (error) {
                console.error('add Info Error:',error)
        }
    }
    const deleteAlumniInfo=async(alumniId)=>{
        try {
            const result =await alumniInfoServices.deleteAlumniInfo(alumniId)
            if(result) 
                return result

        } catch (error) {
             console.error('delete Info Error:',error)
        }
    }
    const updateAlumniInfo=async(alumniId,alumniData)=>{
        try {
            const result=await alumniInfoServices.updateAlumniInfo(alumniId,alumniData)
            if(result)
                return result
            
        } catch (error) {
             console.error('Update Info Error:',error)
        }
        }
    }
 
return (
    <AlumniInfoContext.Provider value={{
        addAlumniInfo,deleteAlumniInfo,updateAlumniInfo
    }}>
        {children}
    </AlumniInfoContext.Provider>
)
export const useAlumniInfo=()=>useContext(AlumniInfoContext)