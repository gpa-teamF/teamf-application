export interface ExecuteResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  status: string;
  executionTimeMs: number;
  error: string;
}


export type ExecuteCodeResponse = ExecuteResult;