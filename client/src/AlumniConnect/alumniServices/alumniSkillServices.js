import api from '../../services/api'
const alumniSkillServices={
    addSkill: async(skillData)=>{
        try {
            const response=await api.post('/alumni/skill',skillData)
           if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response
                    }
        } catch (error) {
             return {
                success:false,
                error:error.message || "Failed to Add Skill Information"
            }
        }
    },
    updateSkill:async(skillId,skillData)=>{
        try {
            const response=await api.put(`/alumni/skill/${skillId}`,skillData)
             if(!response) return{ message:"No Data from backend and This error is from Service function"}

              return {
                    success:true,
                    data:response
                    }

                
        } catch (error) {
            return {
                success:false,
                error:error.message || "Failed to updated Skill Information"
            }
        }
    },
    deleteSkill:async(skillId)=>{
        try {
            const response=await api.delete(`/alumni/skill/${skillId}`,)
             if(!response) return{ message:"No Data from backend and This error is from Service function"}

              return {
                    success:true,
                    data:response
                    }   
        } catch (error) {
            return {
                success:false,
                error:error.message || "Failed to updated Skill Information"
            }
        }
    }
}

export default alumniSkillServices