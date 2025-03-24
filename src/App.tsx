import React, { useState } from 'react';
import './App.css';

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
      const response = await fetch('https://ph7mkpj94l.execute-api.ap-northeast-1.amazonaws.com/dev', { // API Gatewayのエンドポイントを設定
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answer }),
      });

      const data: { result: string } = await response.json();
      setResult(data.result); // Lambda関数からの結果を表示
    } catch (error: any) {
      setResult('エラーが発生しました: ' + error.message);
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