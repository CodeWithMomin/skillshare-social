
import api from "./api";
const currentPositionservice={
    addCurrentPosition: async(userId,CurrentPositionData)=>{
        try {
            const response=await api.post(`/users/${userId}/current`,CurrentPositionData)
            return {
                success:true,
                data:response?.current
            }
        } catch (error) {
            return {
                success:false,
                error:error.message || "Failed to Add Position Information"
            }
        }

    },
    updtedCurrentPosition:async(currentPositionId,currentPositionData)=>{
        try {
            const response=await api.put(`/users/current/${currentPositionId}`,currentPositionData)
            return {
                success:true,
                data:response?.current
            }
        } catch (error) {
            return {
                 success:false,
                error:error.message || "Failed to Update Position Information"
            }
        }
    },
    deleteCurrentPostion :async(userId,currentPositionId)=>{
        try {
            const response=await api.delete(`/users/${userId}/current/${currentPositionId}`)
            return {
                success:true,
                message:"Postion Deleted Successfully.",
                data:response.current
            }
        } catch (error) {
            return {
                 success:false,
                error:error.message || "Failed to Delete position. "
            }
        }
    }

}
export default currentPositionservice