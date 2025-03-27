import { ApiResponse } from "./apiResponse";

export interface judgeAnswerResponseBody {
  result: boolean;
}

export type judgeAnswerResponse = ApiResponse<judgeAnswerResponseBody>;
