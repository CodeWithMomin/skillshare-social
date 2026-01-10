import React from "react";
import { createContext,useContext } from "react";
import alumniBasicInfo from "../alumniServices/alumniBasicInfo";
const BasicInfoContext=createContext()
export const BasicInfoContextProvider=({children})=>{
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
}
return (
    <BasicInfoContext.Provider value={{
        addBasicInfo,updateBasicInfo
    }}>
        {children}
    </BasicInfoContext.Provider>
)
export const usebasicInfo=()=>useContext(BasicInfoContext)