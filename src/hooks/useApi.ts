import { useState, useCallback } from "react";
import axios, { Method, AxiosRequestConfig } from "axios";
import apiClient from "../api/apiClient";
import { ApiState } from "../models/apiState";

const useApi = <T>(initialData: T | null = null): ApiState<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (
      url: string,
      method: Method = "get",
      config: AxiosRequestConfig = {}
    ): Promise<T | undefined> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient<T>({
          url,
          method,
          ...config,
        });
        setData(response.data);
        return response.data;
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          setError(
            `Error: ${e.message} (Status: ${e.response?.status || "N/A"})`
          );
          console.error("API Error:", e.response?.data);
        } else {
          setError("An unexpected error occurred");
        }
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, error, loading, fetchData };
};

export default useApi;
