import React from "react";
import { createContext,useState,useContext } from "react";
import alumniAcademicsServices from "../alumniServices/alumniAcademicsServices";


const AlumniAcademicContext=createContext()
export const AlumniAcademicContextProvider=({children})=>{
    const addAcademics=async(academicData)=>{
        try {
            const result=await alumniAcademicsServices.addAcademics(academicData)
            if(result)
                return result
        } catch (error) {
                console.error('Add Academics Error:',error)
        }
    }
    const deleteAcademics=async(academicId)=>{
        try {
            const result=await alumniAcademicsServices.deleteAcademics(academicId)
            if(result)
                return result
        } catch (error) {
                console.error('Delete Academics Error:',error)
        }
    }
    const updateAcademics=async(academicId,academicData)=>{
        try {
            const result=await alumniAcademicsServices.updateAcademics(academicId,academicId)
            if(result)
                return result
        } catch (error) {
                console.error('update Academics Error:',error)
        }
    }
}
return (
    <AlumniAcademicContext.Provider value={{
        addAcademics,deleteAcademics,updateAcademics
    }}>
        {children}
    </AlumniAcademicContext.Provider>
)
export const useAlumniAcademics=()=>useContext(AlumniAcademicContext)