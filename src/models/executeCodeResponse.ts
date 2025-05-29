export interface ExecuteCodeResponseBody {
  stdout: string;
  stderr: string;
  exitCode: number;
  status: string;
  executionTimeMs: number;
  memoryUsageKb: number;
  error: string;
}


export type ExecuteCodeResponse = ExecuteCodeResponseBody;