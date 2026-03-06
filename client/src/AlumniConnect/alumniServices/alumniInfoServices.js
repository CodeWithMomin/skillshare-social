import alumniapi from '../../services/alumniapi'
const alumniInfoServices={
 addAlumniInfo:async(alumniData)=>{
    try {
           const response=await alumniapi.post('/alumni/alumniInfo',alumniData)
            if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response
                    }
    } catch (error) {
        return {
                success:false,
                error:error.message || "Failed to Add alumni Information"
            }

    }
 },
 updateAlumniInfo:async(alumniId,alumniData)=>{
    try{
        const response=await alumniapi.put(`/alumni/alumniInfo/${alumniId}`,alumniData)
        if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response
                    }
    }catch(error){
            return {
                success:false,
                error:error.message || "Failed to update alumni Information"
            }
    }
 },
 deleteAlumniInfo:async(alumniId)=>{
    try{
        const response=await alumniapi.put(`/alumni/alumniInfo/${alumniId}`)
        if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response
                    }
    }catch(error){
            return {
                success:false,
                error:error.message || "Failed to delete alumni Information"
            }
    }
 }
}
export default alumniInfoServices