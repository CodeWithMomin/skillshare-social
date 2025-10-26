import api from "./api";

const authService={   
 
    register: async (userData)=>{
        try{
            const response=await api.post('/users/register',userData);
            if(response.token) localStorage.setItem('authToken',response.token)
            if(response.user) localStorage.setItem('user',JSON.stringify(response.user))
                return {success:true,response}
        } catch(error){
            return {success:false,error:error.message || 'Registration failed'}
        }
    },


    login: async(credentials)=>{
                try{
                    const response=await api.post('/users/login',credentials)
                    if(response.token) localStorage.setItem('authToken',response.token)
                    if(response.user) localStorage.setItem('user',JSON.stringify(response.user))
                      return {success:true,response}
                }catch(error){
                        return {success:false,message:error.message || 'Login failed.'}
                }
    },




    logout: ()=>{
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        window.location.href='/login'
    },
    //get stored user
    getUser: ()=>{
        const user=localStorage.getItem('user')
        return user? JSON.parse(user):null;
    }
}


export default authService