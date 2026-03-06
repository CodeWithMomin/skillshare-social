import React from "react";
import { createContext,useContext } from "react";
import alumniBasicInfo from "../alumniServices/alumniBasicInfo";
const AlumniBasicInfoContext=createContext()
export const AlumniBasicInfoContextProvider=({children})=>{
    const addBasicInfo=async(basicInfo)=>{
        try {
            const result=await alumniBasicInfo.addAlumniBasicInfo(basicInfo)
            if(result)
                return result
        } catch (error) {
            console.error('Add BasicInfo Error:',error)
        }
    }
    const updateBasicInfo=async(basicInfoId,basicInfo)=>{
        try {
            const result=await alumniBasicInfo.updateAlumniBasicInfo(basicInfoId,basicInfo)
            if(result)
                return result
        } catch (error) {
            console.error('Update basicInfo Error:',error)
        }
    }

return (
    <AlumniBasicInfoContext.Provider value={{
        addBasicInfo,updateBasicInfo
    }}>
        {children}
    </AlumniBasicInfoContext.Provider>
)}
export const usealumnibasicInfo=()=>useContext(AlumniBasicInfoContext)