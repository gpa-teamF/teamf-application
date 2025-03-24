import apiClient from "../apiClient.ts";
import { JudgeAnswerResponse } from "../models/JudgeAnswerResponse";
import { AxiosResponse } from "axios";

export const judgeAnswer = async (
  answer: string
): Promise<AxiosResponse<JudgeAnswerResponse>> => {
  const response = await apiClient.post<JudgeAnswerResponse>("/answer", {
    answer,
  });
  return response;
};
