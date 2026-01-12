import alumniapi from '../../services/alumniapi'
const alumniAuthServices={
    register:async (userData)=>{
        console.log(userData);
        
        try {
            const response=await alumniapi.post('/alumni/register',userData)
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
            const response=await alumniapi.post('/alumni/login',credentials)
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
    getuserProfile:async()=>{
    try {
        const response=await alumniapi.get('/alumni/profile')
        return response.user
    } catch (error) {
        console.error('Error fetching user profile:', error);
    return null;
    }
    }

}
export default alumniAuthServices