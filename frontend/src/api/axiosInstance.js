// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://mi-servidor.com/api', // cambia esto según tu backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Puedes interceptar errores globales
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Error global:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
