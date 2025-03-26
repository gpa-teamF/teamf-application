import { ApiResponse } from "./apiResponse";

export interface JudgeAnswerResponseBody {
  result: boolean;
}

export type JudgeAnswerResponse = ApiResponse<JudgeAnswerResponseBody>;
