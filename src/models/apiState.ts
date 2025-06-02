import { Method, AxiosRequestConfig } from "axios";

export interface ApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetchData: (
    url: string,
    method: Method,
    config?: AxiosRequestConfig
  ) => Promise<T | undefined>;
}
