import axios from "axios";


const BASE_URL ='http://localhost:5000/api';

// ✅Create Axios instance
const alumniapi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }, //  lowercase 'headers'
  timeout: 10000,
});

//  Request Interceptor
alumniapi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alumniAuth_Token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor  (was incorrectly written as request)
alumniapi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {  // ✅ use === not ==
        localStorage.removeItem('alumniAuth_Token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: 'Network error. Try again.' });
    } else {
      return Promise.reject({ message: error.message });
    }
  }
);

export default alumniapi;  //  export so it can be imported in other files
