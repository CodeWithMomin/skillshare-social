import alumniapi from "../../services/alumniapi"
const alumniLanguageServices={
    addlanguage:async (languageData)=>{{
            try {
                const response=await alumniapi.post('/alumni/language',languageData)
                // console.log(response);
                
                 if(!response) return{ message:"No Data from backend and This error is from Service function"}
                
                    return {
                    success:true,
                    data:response.languages
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
            const response=await alumniapi.put(`/alumni/language/${langId}`,languageData)
           
            if(!response) return{ message:"No Data from backend and This error is from Service function"}
            return {
                success:true,
                data:response.languages
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
            const response=await alumniapi.delete(`/alumni/language/${langId}`)
             if(!response) return{ message:"No Data from backend and This error is from Service function"}

             return {
                success:true,
                data:response.languages
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