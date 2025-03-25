import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL, // 環境変数から API のベース URL を取得
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;