// src/utils/axiosInstance.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
