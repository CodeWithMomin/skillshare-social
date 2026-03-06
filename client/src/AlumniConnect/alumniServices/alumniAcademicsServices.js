import alumniapi from '../../services/alumniapi'

const alumniAcademicServices={
    addAcademics:async(academicData)=>{
        try {
            const response=await alumniapi.post('/alumni/academics',academicData)
               if(!response) return{ message:"No Data from backend and This error is from Service function"}
               return {
                    success:true,
                    data:response.Academics
                    }
        } catch (error) {
            return {
                success:false,
                error:error.message || "Failed to Add Academic Information"
            }
        }
    },
    updateAcademics:async(academicId,academicData)=>{
        try{
            const response=await alumniapi.put(`/alumni/academics/${academicId}`,academicData)
            console.log(academicData);
            
                if(!response) return{message:"No Data from backend and this error is from service function"}
                return {
                success:true,
                data:response.Academics
            }
        }catch(error){
            return {
                 success:false,
                 error:error.message || "Failed to Update Academic Information"
                }
        }
    },
    deleteAcademics:async(academicId)=>{
        try{
            const response=await alumniapi.delete(`/alumni/academics/${academicId}`)
            if(!response) return{ message:"No Data from backend and This error is from Service function"}
            return {
                success:true,
                data:response.Academics
            }
        }catch(error){
            return {
                 success:false,
                error:error.message || "Failed to Delete Academic Information"
            }
        }
    }
}


export default alumniAcademicServices