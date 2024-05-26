import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    baseURL: "http://localhost:3031"
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;