import {React ,createContext,useContext,useState} from 'react'
import { useAuth } from './AuthContext'
import languageService from '../services/languageService'


const LanguageContext=createContext();
export const LanguageContextProvider=({children})=>{
    const {user,isAuthenticated}=useAuth();
    const [userLanguages,setUserLanguages]=useState([])

    const addLanguage=async (languageData)=>{
        try {
            if(!isAuthenticated && !user?._id) return;
            const result=await languageService.addLanguage(user?._id,languageData)
            if(result.success){
                setUserLanguages(result.data)
            }
            return result;
        } catch (error) {
            console.error("Add Language Error:",error)
        }
    }

    const deleteLanguage= async (langId)=>{
        try {
            if(!isAuthenticated && user?._id) return;
            const result=await languageService.deleteLanguage(user?._id,langId)
            if(result.success){
                setUserLanguages(result.data)
            }
            return result;
        } catch (error) {
             console.error("Delete Language Error:",error)
        }
    }
    const updatedLanguage=async (langId,languageData)=>{
        try {
             if(!isAuthenticated && user?._id) return;
             const result=await languageService.updateLanguage(langId,languageData) 
             if(result.success){
                setUserLanguages(result.data)
             }
             return result
        } catch (error) {
             console.error("Update Language Error:",error)
        
        }
    };
    return (
        <LanguageContext.Provider value={{
            userLanguages,
            addLanguage,
            deleteLanguage,
            updatedLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    )
};

export const  useLang=()=> useContext(LanguageContext)