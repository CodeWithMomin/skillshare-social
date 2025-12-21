import api from "../../services/api";
const alumniAuthServices={
    register:async (userData)=>{
        console.log(userData);
        
        try {
            const response=await api.post('/alumni/register',userData)
            if(response.alumni_token) localStorage.setItem('alumniToken',response.alumni_token)
                if(response.user) localStorage.setItem('user(alumni)',JSON.stringify(response.user))
            return {
                    success:true,
                    response
            }
            
        } catch (error) {
             return {success:false,error:error.message || 'Registration failed'}
        }
    },
    login:async (credentials)=>{
        try{
            const response=await api.post('/alumni/login',credentials)
              if(response.alumni_token) localStorage.setItem('alumniToken',response.alumni_token)
                if(response.user) localStorage.setItem('user(alumni)',JSON.stringify(response.user))
                 return {success:true,response}
        } catch(error){
             return {success:false,message:error.message || 'Login failed.'}
        }
    },
    logout:()=>{
        localStorage.removeItem('alumniToken')
        localStorage.removeItem('user(alumni)')
    },
      getUser: ()=>{
        const user=localStorage.getItem('user(alumni)')
        return user? JSON.parse(user):null;
    },

}
export default alumniAuthServices