export interface testResult {
  testcaseId: number;
  status: "AC" | "WA" | "TLE" | "MLE" | "CE";
  executionTime: number; // ms
  memoryUsage: number;   // KB
}

export interface evaluateResult {
  totalScore: number;
  correctnessScore: number;
  performanceScore: number;
  algorithmsScore: number;
  codeQualityScore: number;
  readabilityScore: number;
  }

export type testResults = testResult[];

export interface evaluateCodeResponse {
  testResults: testResults;
  evaluateResult: evaluateResult
}
