import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://gigflow-r4bw.onrender.com/api',
    withCredentials: true,
});

export default instance;
