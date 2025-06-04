import React from "react";
import "./ProblemCard.css";
import { ProblemData } from "../../../models/getProblemsResponse";

interface ProblemCardProps {
  problemData: ProblemData;
  remainingTime: number; // 秒
  totalTime: number; // 秒
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problemData,
  remainingTime,
  totalTime,
}) => {
  const percentage = (remainingTime / totalTime) * 100;

  let barColor = "#b039ff";
  if (remainingTime <= 60) barColor = "#ff9800"; // orange
  if (remainingTime <= 30) barColor = "#f44336"; // red

  return (
    <main className="problem-container">
      <div className="problem-header">
        <h1 className="problem-title">{problemData.problemName}</h1>
        <div className="timer-container">
          <div className="timer-bar-bg">
            <div
              className="timer-bar-fill"
              style={{
                width: `${percentage}%`,
                backgroundColor: barColor,
              }}
            ></div>
          </div>
          <span className="timer-text">{remainingTime}s</span>
        </div>
      </div>

      <p>
        TLE（実行時間制限）目安: {problemData.timeLimit} ms &nbsp; &nbsp; /
        &nbsp; &nbsp; MLE（メモリ使用量制限）目安: {problemData.memoryLimit} KB
      </p>

      <div className="sub-section">
        <h2 className="problem-subtitle">問題文</h2>
        <p className="context">{problemData.problemText}</p>
      </div>

      <div className="sub-section">
        <h2 className="problem-subtitle">制約</h2>
        <p className="context">{problemData.constraints}</p>
        <hr />
      </div>

      <div className="sub-section">
        <h2 className="problem-subtitle">入力</h2>
        <p className="context">{problemData.inputFormat}</p>
      </div>

      <div className="sub-section">
        <h2 className="problem-subtitle">出力</h2>
        <p className="context">{problemData.outputFormat}</p>
        <hr />
      </div>

      <div className="sub-section">
        <h2 className="problem-subtitle">入出力例</h2>
        {problemData.inputExamples.map((example, index) => (
          <div key={index}>
            <h3>入力例 {index + 1}</h3>
            <div className="example-code">{example}</div>
            <h3>出力例 {index + 1}</h3>
            <div className="example-code">
              {problemData.outputExamples[index]}
            </div>
            <hr />
          </div>
        ))}
      </div>
    </main>
  );
};

export default ProblemCard;
