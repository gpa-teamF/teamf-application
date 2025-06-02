import { ExecuteCodeResponse } from "./executeCodeResponse";
import { ProblemData } from "./getProblemsResponse";
import { SubmitResultResponse } from "./submitResultResponse";

export interface ProblemState {
  code: string;
  stdin: string;
  language: string;
  executionResult?: ExecuteCodeResponse;
  submitResult?: SubmitResultResponse;
  problemData?: ProblemData;
}
