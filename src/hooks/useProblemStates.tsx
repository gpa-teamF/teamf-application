import { useState } from "react";
import { ProblemData } from "../models/getProblemsResponse";
import { ExecuteResult } from "../models/executeCodeResponse";
import { SubmitResult } from "../models/submitResultResponse";

interface ProblemState {
  problemData: ProblemData | null;
  executionResult: ExecuteResult | null;
  submissionResult: SubmitResult | null;
}

type ProblemStates = Record<number, ProblemState>;

export function useProblemStates() {
  const [problemStates, setProblemStates] = useState<ProblemStates>({});

  const setProblemData = (index: number, data: ProblemData) => {
    setProblemStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        problemData: data,
        executionResult: prev[index]?.executionResult || null,
        submissionResult: prev[index]?.submissionResult || null,
      },
    }));
  };

  const setExecutionResult = (index: number, result: ExecuteResult) => {
    setProblemStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        problemData: prev[index]?.problemData || null,
        executionResult: result,
        submissionResult: prev[index]?.submissionResult || null,
      },
    }));
  };

  const setSubmissionResult = (index: number, result: SubmitResult) => {
    setProblemStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        problemData: prev[index]?.problemData || null,
        executionResult: prev[index]?.executionResult || null,
        submissionResult: result,
      },
    }));
  };

  return {
    problemStates,
    setProblemData,
    setExecutionResult,
    setSubmissionResult,
  };
}
