export interface ProblemData {
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

export type GetProblemsResponse = ProblemData[];