import {React,createContext,useContext,useState} from 'react'
import { useAuth } from './AuthContext'
import basicInfoService from '../services/basicInfoService'

const BasicInfoContext=createContext()
export const BasicInfoContextProvider=({children})=>{
    const {user,isAuthenticated}=useAuth()
    

    const addBasicInfo=async(basicInfoData)=>{
        try {
            if(!isAuthenticated &&  !user?._id) return;
            const result=await basicInfoService.addBasicInfo(user?._id,basicInfoData)
            if(result.success){
                // 
            }
            return result
        } catch (error) {
             console.log.error('Add Position Error:')
        }
    }
    const updateBasicInfo=async(basicInfoId,basicInfoData)=>{
        try {
              if(!isAuthenticated &&  !user?._id) return;
              const result =await basicInfoService.updateBasicInfo(basicInfoId,basicInfoData)
              if(result.success)
              {

              }
              return result
        } catch (error) {
            
        }
    }
    return (
        <BasicInfoContext.Provider value={
            {
                addBasicInfo,
                updateBasicInfo
            }
        }>
            {children}
        </BasicInfoContext.Provider>
    )
}
export const useBasicInfo=()=> useContext(BasicInfoContext)