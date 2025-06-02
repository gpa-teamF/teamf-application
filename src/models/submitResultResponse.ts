export interface TestResult {
  testcaseId: number;
  status: "AC" | "WA" | "TLE" | "MLE" | "CE" | "RE";
  executionTime: number; // ms
  memoryUsage: number;   // KB
}

export interface EvaluateResult {
  totalScore: number;
  correctnessScore: number;
  performanceScore: number;
  algorithmsScore: number;
  codeQualityScore: number;
  readabilityScore: number;
  }

export type TestResults = TestResult[];

export interface SubmitResult {
  testResults: TestResults;
  evaluateResult: EvaluateResult
  error: string
}

export type SubmitResultResponse = SubmitResult;