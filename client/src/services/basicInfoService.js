import api from "./api";
const basicInfoService={
    addBasicInfo:  async(userId,basicInfoData)=>{
        try{
            const response=await api.post(`/users/${userId}/basicInfo`,basicInfoData)
            return {
                success:true,
                data:response?.basicInfo
            }
        } catch (error) {
            return {
                success:false,
                error:error.message || "Failed to Add basic Information"
            }
        }

    },
    updateBasicInfo: async(basicInfoId,basicInfoData)=>{
        try {
            const response=await api.put(`/users/basicInfo/${basicInfoId}`,basicInfoData)
            return {
                success:true,
                data:response?.basicInfo
            }
        } catch (error) {
            return {
                 success:false,
                error:error.message || "Failed to Update Basic Information"
            }
        }
    }
}
export default basicInfoService