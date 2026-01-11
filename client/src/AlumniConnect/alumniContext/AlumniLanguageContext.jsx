import React from "react";
import { createContext,useEffect,useState } from "react";
import alumniLanguageServices from "../alumniServices/alumniLanguageServices";
import { useAlumniAuth } from "./AlumniAuthContext";
import { useContext } from "react";
const AlumniLanguageContext=createContext()
export const AlumniLanguageContextProvider=({children})=>{
    const addLanguage=async(languageData)=>{
        try {
            const result=await alumniLanguageServices.addlanguage(languageData)
            if(result)
                
                return result
        } catch (error) {
             console.error('Add Language Error:',error)
        }
    }
    const deleteLanguage=async(langId)=>{
        try {
            const result=await alumniLanguageServices.deleteLanguage(langId)
            if(result)
                return result
        } catch (error) {
            console.error('delete Language Error:',error)
        }
    }
    const updateLanguage=async(langId,languageData)=>{
        try {
            const result=await alumniLanguageServices.updateLanguage(langId,languageData)
            if(result)
                return result;
        } catch (error) {
            console.error('Update Language Error:',error)
        }
    }
}
return (
    <AlumniLanguageContext.Provider value={{
        addLanguage,deleteLanguage,updatelanguage
    }}>
        {children}
    </AlumniLanguageContext.Provider>
)
export const useAlumniLanguages=()=> useContext(AlumniLanguageContext)