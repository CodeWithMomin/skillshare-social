import alumniapi from '../../services/alumniapi'
const alumniAcheivementServices={
    addAcheivement:async (acheivementData)=>{
            try{
                const response=await alumniapi.post('/alumni/acheivement',acheivementData)
                if(!response) return{ message:"No Data from backend and This error is from Service function"}
                
                    return {
                    success:true,
                    data:response.Acheivements
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
                const response=await alumniapi.put(`/alumni/acheivement/${acheivementId}`,acheivementData)
                if(!response) return{ message:"No Data from backend and This error is from Service function"}
                
                    return {
                    success:true,
                    data:response.Acheivements
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
                const response=await alumniapi.delete(`/alumni/acheivement/${acheivementId}`)
                if(!response) return{ message:"No Data from backend and This error is from Service function"}
                
                    return {
                    success:true,
                    data:response.Acheivements
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