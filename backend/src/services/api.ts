// src/services/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000',
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      // Prioriza o token da sessão ativa do EcoWave, se não achar, busca no localStorage
      const token = sessionStorage.getItem('ecoWave_token') || localStorage.getItem('userToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;