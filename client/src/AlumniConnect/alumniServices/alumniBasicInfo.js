import alumniapi from '../../services/alumniapi'
const alumniBasicInfo={
   addAlumniBasicInfo:async(basicInfo)=>{
     try{
        const response=await alumniapi.post('/alumni/basicinfo',basicInfo)
         if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response.basicInfo
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
        const response=await alumniapi.put(`/alumni/basicinfo/${basicInfoId}`,basicInfo)
    if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response.basicInfo
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