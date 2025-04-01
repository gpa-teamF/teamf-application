import { ApiResponse } from "./apiResponse";

export interface getProblemResponseBody {
  problemId: string;
  problemName?: string;
  problemText: string;
  constraints?: string[];
  inputFormat?: string;
  outputFormat?: string;
  inputExamples?: string[];
  outputExamples?: string[];
}

export type getProblemResponse = ApiResponse<getProblemResponseBody>;
