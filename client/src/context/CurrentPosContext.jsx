import {React,createContext,useContext,useState} from 'react'
import { useAuth } from './AuthContext'
import currentPositionservice from '../services/currentPositionService'


const currentPositionContext=createContext();
export const CurrentPositionContextProvider=({children})=>{
    const{user,isAuthenticated}=useAuth();
    const [usersCurrentPostion,setUsersCurrentPosition]=useState([])
    

    const addCurrentPosition=async(PositionData)=>{
        try {
            if(!isAuthenticated &&  !user?._id) return;
            const result=await currentPositionservice.addCurrentPosition(user?._id,PositionData )
            if(result.success){
                setUsersCurrentPosition(result.data)
            }
            return result;
        } catch (error) {
            console.log.error('Add Position Error:')
        }
    }
    const deleteCurrentPosition=async(currentPositionId)=>{
    try {
        if(!isAuthenticated && !user?._id ) return;
        const result=await currentPositionservice.deleteCurrentPostion(user?._id,currentPositionId)
        if(result.success){
          setUsersCurrentPosition(result.data)
        }
        return result
    } catch (error) {
        console.error('Failed to Delete Position Error.',error)
    }
}
const updateCurrentPosition=async(currentPositionId,PositionData)=>{
    try {
         if(!isAuthenticated && !user?._id ) return;
         const result =await  currentPositionservice.updtedCurrentPosition(currentPositionId,PositionData)
         if(result.success){
            setUsersCurrentPosition(result.data)
         }
         return result
    } catch (error) {
        console.error('Update Position Error',error)
    }
};
return (
    <currentPositionContext.Provider value={
        {
            usersCurrentPostion,
            addCurrentPosition,
            deleteCurrentPosition,
            updateCurrentPosition
        }
    }>
        {children}
    </currentPositionContext.Provider>
)
}
export const useCurrentPosition=()=> useContext(currentPositionContext)
