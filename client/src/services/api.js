import axios from "axios";


const BASE_URL ='http://localhost:5000/api';

// ✅Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  // headers: { 'Content-Type': 'application/json' }, //  lowercase 'headers'
  timeout: 10000,
});

//  Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor  (was incorrectly written as request)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {  // ✅ use === not ==
        localStorage.removeItem('authToken');
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

export default api;  //  export so it can be imported in other files
