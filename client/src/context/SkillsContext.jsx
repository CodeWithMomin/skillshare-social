import {React,createContext,useContext,useState} from 'react'
import { useAuth } from './AuthContext'
import skillsService from '../services/skillsService'
import { data } from 'react-router-dom'

const SkillContext=createContext()
export const SkillContextProvider=({children})=>{
    const{user,isAuthenticated}=useAuth()
    const [userSkills,setUserSkills]=useState([])
    const addSkill=async(skillData)=>{
        try {
           
            const result=await skillsService.addSkill(user?._id,skillData)
            if(result.success){
                setUserSkills(result.data)
            }
            return result;
        } catch (error) {
            console.error('Add Skill Error:',error)
        }
    }
    const deleteSkill= async(skillId)=>{
        try {
            const result=await skillsService.deleteSkill(user?._id,skillId)
            if(result.success)
            {
                setUserSkills(result.data)
            }
            return result;
        } catch (error) {
            console.error('Delete skill failed.:',error)
        }
    }
    const updateSkill=async (skillId,skillData)=>{
        try {
            const result=await skillsService.updateSkill(skillId,skillData)
            if(result.success){
                setUserSkills(result.data)
            }
            return result
        } catch (error) {
            console.error('Update SKill failed:',error)
        }
    }
    return (
        <SkillContext.Provider value={
            {
                userSkills,
                addSkill,
                deleteSkill,
                updateSkill
            }
        }>
            {children}
        </SkillContext.Provider>
    )
}

export const useSkills=()=> useContext(SkillContext)