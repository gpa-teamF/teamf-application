import React, { useState } from 'react';
import './App.css';
import { judgeAnswer } from './api/judgeAnswer';
import axios from 'axios';

function App() {
  const [problem, ] = useState<string>("1 + 1 = ?"); // 問題文
  const [answer, setAnswer] = useState<string>(''); // 回答
  const [result, setResult] = useState<string>(''); // 結果
  const [message, setMessage] = useState<string | undefined>(undefined); // メッセージ

  // 回答の提出
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult('送信中...');
    setMessage(undefined); // メッセージをクリア
    try {
      const response = await judgeAnswer(answer);
      setResult(response.data.body.result ? '正解！' : '不正解...');
      setMessage(response.data.message); // メッセージを設定
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage('エラーが発生しました: ' + error.message);
      } else {
        setMessage('不明なエラーが発生しました');
      }
      setResult(''); // 結果をクリア
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
      {message && <p>Message: {message}</p>} {/* メッセージを表示 */}
    </div>
  );
}

export default App;