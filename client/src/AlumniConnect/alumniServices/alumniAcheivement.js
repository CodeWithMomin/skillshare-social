import api from '../../services/api'
const alumniAcheivementServices={
    addAcheivement:async (acheivementData)=>{
            try{
                const response=await api.post('/alumni/acheivement',acheivementData)
                if(!response) return{ message:"No Data from backend and This error is from Service function"}
                
                    return {
                    success:true,
                    data:response
                    }
               
            }catch(error){
                 return {
                success:false,
                error:error.message || "Failed to Add Acheivements Information"
            }
            }
            },
            updateAcheivement:async (acheivementId,acheivementData)=>{
            try{
                const response=await api.put(`/alumni/acheivements/${acheivementId}`,acheivementData)
                if(!response) return{ message:"No Data from backend and This error is from Service function"}
                
                    return {
                    success:true,
                    data:response
                    }
               
            }catch(error){
                 return {
                success:false,
                error:error.message || "Failed to update Acheivements Information"
            }
            }
            },
            deleteAcheivement:async (acheivementId)=>{
            try{
                const response=await api.delete(`/alumni/acheivements/${acheivementId}`)
                if(!response) return{ message:"No Data from backend and This error is from Service function"}
                
                    return {
                    success:true,
                    data:response
                    }
               
            }catch(error){
                 return {
                success:false,
                error:error.message || "Failed to delete Acheivements Information"
            }
            }
            }

    }
export default alumniAcheivementServices