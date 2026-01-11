import api from "../../services/api"
const alumniLanguageServices={
    addlanguage:async (languageData)=>{{
            try {
                const response=await api.post('/alumni/language',languageData)
                 if(!response) return{ message:"No Data from backend and This error is from Service function"}
                
                    return {
                    success:true,
                    data:response
                    }
               
              
                   
                
            } catch (error) {
                 return {
                success:false,
                error:error.message || "Failed to Add Language Information"
            }
            }
    }},
    updateLanguage:async (langId,languageData)=>{
        try {
            const response=await api.put(`/alumni/language/${langId}`,languageData)
           
            if(!response) return{ message:"No Data from backend and This error is from Service function"}
            return {
                success:true,
                data:response
            }
            
        } catch (error) {
             return {
                 success:false,
                error:error.message || "Failed to Update Language Information"
            }
        }
    },
    deleteLanguage:async (langId)=>{
        try {
            const response=await api.delete(`/alumni/language/${langId}`)
             if(!response) return{ message:"No Data from backend and This error is from Service function"}

             return {
                success:true,
                data:response
             }
        } catch (error) {
            return {
                 success:false,
                error:error.message || "Failed to Delete Language "
            }
        }
    }
}
export default alumniLanguageServices