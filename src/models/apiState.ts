import { Method, AxiosRequestConfig } from "axios";
import { ApiResponse } from "./apiResponse";
export interface ApiState<T> {
  data: ApiResponse<T> | null;
  error: string | null;
  loading: boolean;
  showLoading: boolean;
  fetchData: (
    url: string,
    method: Method,
    config?: AxiosRequestConfig
  ) => Promise<void>;
}
