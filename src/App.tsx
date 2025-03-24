import React, { useState } from 'react';
import './App.css';

interface ApiResponse {
  statusCode: number;
  body: { result: boolean };
  headers: { [key: string]: string };
}

function App() {
  const [problem, setProblem] = useState<string>("1 + 1 = ?"); // 問題文
  const [answer, setAnswer] = useState<string>(''); // 回答
  const [result, setResult] = useState<string>(''); // 結果

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // ここにAPI Gateway経由でLambda関数を呼び出す処理を記述します
    // (後ほど実装)
    setResult('送信中...'); // 送信中の表示
    try {
      const response = await fetch(
        // process.env.REACT_APP_API_ENDPOINT || '', { // API Gatewayのエンドポイントを設定
        "https://ph7mkpj94l.execute-api.ap-northeast-1.amazonaws.com/dev", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answer }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      const result = data.body.result; // bodyからresultを抽出
      setProblem(`result: ${JSON.stringify(result)}`);
      setResult(result ? '正解！' : '不正解...'); // Lambda関数からの結果を表示
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult('エラーが発生しました: ' + error.message);
      } else {
        setResult('不明なエラーが発生しました');
      }
    }
  };

  return (
    <div className="App">
      <h1>社内競プロアプリ</h1>
      <p>問題: {problem}</p>
      <form onSubmit={handleSubmit}>
        <label>
          回答:
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </label>
        <button type="submit">送信</button>
      </form>
      <p>結果: {result}</p>
    </div>
  );
}

export default App;