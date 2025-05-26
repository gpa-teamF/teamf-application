export interface getProblemResponseBody {
  problemName: string;
  problemId: string;
  problemText: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  inputExamples: string[];
  outputExamples: string[];
  timeLimit: string;
  memoryLimit: string;
}

// 単一問題用
// export type getProblemResponse = getProblemResponseBody;

// 複数問題取得用
export type getMultipleProblemResponse = getProblemResponseBody[];