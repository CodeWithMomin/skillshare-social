
import api from "./api";

const educationService={
    getEducation: async (userId)=>{
        try{
            const response= await api.get(`users/${userId}/education`)
                return {success:true,data:response.data}
        } catch(error){
            return { success: false, error: error.message || 'Failed to fetch education data' };
        }
    },
    addEducation: async (userId,educationData)=>{
        try{
            const response=await api.post(`users/${userId}/education`,educationData)
                return {success:true,data:response.data}
        }   catch(error){
            return {success:false,error:error.message|| 'Failed to Add Education Data.'}
        }
    },
    updateEducation: async (eduId,educationData)=>{
        try{
            const response=await api.put(`users/education/${eduId}`,educationData)
            return {success:true,data:response.education}
        }
        catch(error){
            return {success:false,error:error.message || 'Failed to Update Education Data'}
        }
    },
    deleteEducation: async (userId,eduId)=>{
        try{
            const response =await api.delete(`users/${userId}/education/${eduId}`)
            return {success:true,data:response.data}
        } catch(error){
                return {success:false ,message:error.message || 'Failed to delete Education Data.'}
        }
    }
    
    

    
}
export default educationService