import api from "./api";
const languageService={
    addLanguage: async (userId,languageData)=>{
        try {
            const response=await api.post(`/users/${userId}/languages`,languageData)
            return {
                success:true,
                data:response?.data?.languages || response?.languages
            }
        } catch (error) {
            return {
                success:false,
                error:error.message || "Failed to Add Language Information"
            }
        }
    },
    updateLanguage: async(langId,languageData)=>{
        try {
            const response=await api.put(`/users/languages/${langId}`,languageData)
            return {
                success:true,
                data:response?.languages
            }
        } catch (error) {
            return {
                 success:false,
                error:error.message || "Failed to Update Language Information"
            }
        }
    },
    deleteLanguage :async(userId,langId)=>{
        try {
            const response=await api.delete(`/users/${userId}/languages/${langId}`)
            return {
                success:true,
                data:response?.languages
            }
        } catch (error) {
             return {
                 success:false,
                error:error.message || "Failed to Delete Language "
            }
        }
    }
}


export default languageService