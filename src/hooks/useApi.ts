import { useState, useCallback } from "react";
import axios, { Method, AxiosRequestConfig } from "axios";
import { ApiResponse } from "../models/apiResponse";
import apiClient from "../api/apiClient"; // apiClient をインポート
import { ApiState } from "../models/apiState";

const useApi = <T>(initialData: ApiResponse<T> | null = null): ApiState<T> => {
  const [data, setData] = useState<ApiResponse<T> | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false); // ローディングアイコンを表示するかどうか

  const fetchData = useCallback(
    async (
      url: string,
      method: Method = "get",
      config: AxiosRequestConfig = {}
    ) => {
      let timer: NodeJS.Timeout; // タイマーを定義

      const startLoadingTimer = () => {
        timer = setTimeout(() => {
          setShowLoading(true); // 300ms 経過後にローディングアイコンを表示
        }, 300);
      };

      const clearLoadingTimer = () => {
        clearTimeout(timer); // タイマーをクリア
        setShowLoading(false); // ローディングアイコンを非表示
      };

      setLoading(true);
      setError(null);
      startLoadingTimer(); // タイマーを開始

      try {
        const response = await apiClient<ApiResponse<T>>({
          url,
          method,
          ...config,
        });
        setData(response.data);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          setError(
            `Error: ${e.message} (Status: ${e.response?.status || "N/A"})`
          );
          console.error("API Error:", e.response?.data);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
        clearLoadingTimer(); // レスポンス受信時にタイマーをクリア
      }
    },
    []
  );

  return { data, error, loading, fetchData, showLoading }; // showLoading を返す
};

export default useApi;
