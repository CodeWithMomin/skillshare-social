import api from "./api";
const skillsService={
    addSkill: async(userId,skillData)=>{
        try {
            const response=await api.post(`/users/${userId}/skills`,skillData)
            return {success:true,data:response.skills}
        } catch (error) {
            return {
                success:false,
                error:error.message || 'Failed to Add Skill.'
            };
        }
    },
    updateSkill: async(skillId,skillData)=>{
        try {
            const response=await api.put(`/users/skills/${skillId}`,skillData)
            return {
                success:response.success,
                data:response?.skills}
        } catch (error) {
            return {
                success:false,
                error:error.message || 'Failed to Update Skill Information.'}
        }
    },
    deleteSkill: async(userId,skillId)=>{
        try {
            const response=await api.delete(`/users/${userId}/skills/${skillId}`)
            return {
                success:true,
                data:response.skills
            }
        } catch (error) {
            return {success:false,error:error.message || 'Failed to delete Skill.'}
        }
    }
}
export default skillsService;