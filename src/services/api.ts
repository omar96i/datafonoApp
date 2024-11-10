import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_URL = 'http://10.0.2.2:8000/api/'; 
const API_URL = 'https://datafono.propicash.com/api/'; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCSRFToken = () => {
  return api.get('/sanctum/csrf-cookie');
};

export default api;
