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

// 複数問題取得用
export type getMultipleProblemResponse = getProblemResponseBody[];