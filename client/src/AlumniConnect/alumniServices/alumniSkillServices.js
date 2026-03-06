// import api from '../../services/api'
import alumniapi from '../../services/alumniapi'
const alumniSkillServices={
    addSkill: async(skillData)=>{
        try {
            const response=await alumniapi.post('/alumni/skill',skillData)
           if(!response) return{ message:"No Data from backend and This error is from Service function"}
            
          return {
                    success:true,
                    data:response.skills
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
            const response=await alumniapi.put(`/alumni/skill/${skillId}`,skillData)
             if(!response) return{ message:"No Data from backend and This error is from Service function"}

              return {
                    success:true,
                    data:response.skills
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
            const response=await alumniapi.delete(`/alumni/skill/${skillId}`,)
             if(!response) return{ message:"No Data from backend and This error is from Service function"}

              return {
                    success:true,
                    data:response.skills
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