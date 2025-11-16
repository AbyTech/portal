import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // only base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token; // must match backend
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
