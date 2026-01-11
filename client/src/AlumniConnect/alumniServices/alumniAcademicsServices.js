import api from '../../services/api'

const alumniAcademicServices={
    addAcademics:async(academicData)=>{
        try {
            const response=await api.post('/alumni/academics',academicData)
               if(!response) return{ message:"No Data from backend and This error is from Service function"}
               return {
                    success:true,
                    data:response
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
            const response=await api.put(`/alumni/academics/${academicId}`,academicData)
                if(!response) return{message:"No Data from backend and this error is from service function"}
                return {
                success:true,
                data:response
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
            const response=await api.delete(`/alumni/academics/${academicId}`)
            if(!response) return{ message:"No Data from backend and This error is from Service function"}
            return {
                success:true,
                data:response
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