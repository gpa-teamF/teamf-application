export interface ApiResponse<T> {
  statusCode: number;
  body: T;
  message?: string; // オプションのメッセージフィールド
}
