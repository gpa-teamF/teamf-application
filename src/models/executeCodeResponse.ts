export interface ExecuteCodeResponseBody {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: string;
  memoryUsage: string;
}

export type ExecuteCodeResponse = ExecuteCodeResponseBody;