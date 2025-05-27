import React from "react";
import "./ProblemCard.css";

interface ProblemProps {
  problemName: string;
  problemText: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  inputExamples: string[];
  outputExamples: string[];
  timeLimit: string;
  memoryLimit: string;
}

const Problem: React.FC<ProblemProps> = ({
  problemName,
  problemText,
  constraints,
  inputFormat,
  outputFormat,
  inputExamples,
  outputExamples,
  timeLimit,
  memoryLimit,
}) => {
  return (
    <main className="problem-container">
      <h1 className="problem-title">{problemName}</h1>
      <p>
        実行時間制限: {timeLimit} sec / メモリ制限: {memoryLimit} MB
      </p>
      <div className="sub-section">
        <h2 className="problem-subtitle">問題文</h2>
        <p className="context">{problemText}</p>
      </div>

      <div className="sub-section">
        <h2 className="problem-subtitle">制約</h2>
        <p className="context">{constraints}</p>
        <hr></hr>
      </div>

      <div className="sub-section">
        <h2 className="problem-subtitle">入力</h2>
        <p className="context">{inputFormat}</p>
      </div>

      <div className="sub-section">
        <h2 className="problem-subtitle">出力</h2>
        <p className="context">{outputFormat}</p>
        <hr></hr>
      </div>

      <div className="sub-section">
        <h2 className="problem-subtitle">入出力例</h2>
        {inputExamples.map((example, index) => (
          <div key={index} className="">
            <h3>入力例 {index + 1}</h3>
            <div className="example-code">{example}</div>
            <h3>出力例 {index + 1}</h3>
            <div className="example-code">{outputExamples[index]}</div>
            <hr></hr>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Problem;
