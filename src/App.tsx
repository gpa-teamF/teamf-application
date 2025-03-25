import React, { useState } from 'react';
import './App.css';
import { judgeAnswer } from './api/judgeAnswer';
import axios from 'axios';

function App() {
  const [problem, ] = useState<string>("1 + 1 = ?"); // 問題文
  const [answer, setAnswer] = useState<string>(''); // 回答
  const [result, setResult] = useState<string>(''); // 結果
  console.log(import.meta.env.VITE_API_BASE_URL)

  // 回答の提出
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult('送信中...');
    try {
      const response = await judgeAnswer(answer);
      setResult(response.data.result ? '正解！' : '不正解...');
      console.log("response:", response);
      console.log("response.data:", response.data);
      console.log("Status Code:", response.status);
      console.log("Headers:", response.headers);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
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