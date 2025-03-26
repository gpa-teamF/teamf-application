import { ApiResponse } from "./apiResponse";

export interface getProblemResponseBody {
  problemId: string;
  problemText: string;
}

export type getProblemResponse = ApiResponse<getProblemResponseBody>;
