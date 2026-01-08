import api from '../../services/api'
const alumniBasicInfo={
   addAlumniBasicInfo:async(basicInfo)=>{
     try{
        const response=await api.post('/alumni/basicinfo',basicInfo)
         if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response
                    }
    }catch(error){
        return {
                success:false,
                error:error.message || "Failed to Add alumni Basic Information"
            }
    }
   },
   updateAlumniBasicInfo:async(basicInfoId,basicInfo)=>{
    try {
        const response=await api.put(`/alumni/basicinfo/${basicInfoId}`,basicInfo)
    if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response
                    }
    } catch (error) {
         return {
                success:false,
                error:error.message || "Failed to update alumni Basic Information"
            }
    }
   }

   
}
export default alumniBasicInfo