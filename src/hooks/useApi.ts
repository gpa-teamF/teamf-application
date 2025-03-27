import { useState, useCallback } from "react";
import axios, { Method, AxiosRequestConfig } from "axios";
import { ApiResponse } from "../models/apiResponse";
import apiClient from "../api/apiClient"; // apiClient をインポート
import { ApiState } from "../models/apiState";

const useApi = <T>(initialData: ApiResponse<T> | null = null): ApiState<T> => {
  const [data, setData] = useState<ApiResponse<T> | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (
      url: string,
      method: Method = "get",
      config: AxiosRequestConfig = {}
    ) => {
      setLoading(true);
      setError(null);

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
      }
    },
    []
  );

  return { data, error, loading, fetchData };
};

export default useApi;
