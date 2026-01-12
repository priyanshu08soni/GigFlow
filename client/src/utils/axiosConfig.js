import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://gigflow-r4bw.onrender.com/api',
    withCredentials: true,
});

export default instance;
