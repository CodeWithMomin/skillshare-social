import React from "react";
import { createContext,useState,useContext } from "react";
import alumniSkillServices from "../alumniServices/alumniSkillServices";
import { useAlumniAuth } from "./AlumniAuthContext";



const AlumniSkillContext=createContext()
export const AlumniSkillContextProvider=({children})=>{
    const{alumniUser,isAlumniAuthenticated}=useAlumniAuth()
    const [alumniSkills,setAlumniSkills]=useState([])
    const addSkill=async(skillData)=>{
        try {
            const result=await alumniSkillServices.addSkill(skillData)
        if(result.success){
            setAlumniSkills(result)
        }
        return result
        } catch (error) {
             console.error('Add Skill Error:',error)
        }
    }
    const deleteSkill=async(skillId)=>{
        try {
            const result=await alumniSkillServices.deleteSkill(skillId)
            if(result.success){
                setAlumniSkills(result)
            }
            return result;
        } catch (error) {
             console.error('Delete Skill Error:',error)
        }
    }
    const updateSkill=async(skillId,skillData)=>{
        try{
            const result=await alumniSkillServices.updateSkill(skillId,skillData)
            if(result.success){
                setAlumniSkills(result)
            }
        }catch(error){
             console.error('Update SKill failed:',error)
        }
    }
}
return (
    <AlumniSkillContext.Provider value={
        {
            addSkill,deleteSkill,updateSKill
        }
    }>
        {children}
    </AlumniSkillContext.Provider>
)
export const useAlumniSkills=()=>useContext(AlumniSkillContext)