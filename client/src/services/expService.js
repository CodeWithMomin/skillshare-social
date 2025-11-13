
import api from "./api";

const expService={
    getExperience: async(userId)=>{
        try{
            const response=await api.get(`/users/${userId}/experience`)
            return {success:true,data:response.data}
        } catch(error){
            return {success:false,error:error.message || "Failed to fetch Experince."}
        }
    },
    addExperience:async(userId,experienceData)=>{
        try{
            const response= await api.post(`/users/${userId}/experience`,experienceData)
             return {success:true,data:response.experience}
        } catch (error){
             return {success:false,error:error.message || "Failed to Add Experince."}
        }
    },
    updateExperience: async (expId,experienceData)=>{
       
        
            try{
                const response=await api.put(`users/experience/${expId}`,experienceData)
                return {success:true,data:response.experience}
            }
            catch(error){
                return {success:false,error:error.message || 'Failed to Update Experience  Data'}
            }
        },
        deleteExperience: async (userId,expId)=>{
                try{
                    const response =await api.delete(`users/${userId}/experience/${expId}`)
                    return {success:true,data:response.data}
                } catch(error){
                        return {success:false ,message:error.message || 'Failed to delete experience Data.'}
                }
            }
            
}


export default expService