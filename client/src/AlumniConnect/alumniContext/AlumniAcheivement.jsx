import React from "react";
import { createContext,useContext } from "react";
import alumniAcheivementServices from "../alumniServices/alumniAcheivement";
 const AlumniAcheivementContext=createContext()
 export const AlumniAcheivementContextProvider=({children})=>{
    const addAcheivement=async(acheivementData)=>{
        try {
            const result=await alumniAcheivementServices.addAcheivement(acheivementData)
            if(result)
                return result
        } catch (error) {
                console.error('add acheivement Error:',error)
        }
    }
    const deleteAcheivement=async(acheivementId)=>{
        try {
            const result =await alumniAcheivementServices.deleteAcheivement(acheivementId)
            if(result) 
                return result

        } catch (error) {
             console.error('delete acheivement Error:',error)
        }
    }
    const updateAcheivement=async(acheivementId,acheivementData)=>{
        try {
            const result=await alumniAcheivementServices.updateAcheivement(acheivementId,acheivementData)
            if(result)
                return result
            
        } catch (error) {
             console.error('Update acheivement Error:',error)
        }
        }
    }
 
return (
    <AlumniAcheivementContext.Provider value={{
        addAcheivement,deleteAcheivement,updateAcheivement
    }}>
        {children}
    </AlumniAcheivementContext.Provider>
)
export const useAlumniAcheivement=useContext(AlumniAcheivementContext)