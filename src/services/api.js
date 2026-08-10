import axios from 'axios';

const api = axios.create({
  baseURL: 'https://community-share-backend.onrender.com/api'
  //  baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;