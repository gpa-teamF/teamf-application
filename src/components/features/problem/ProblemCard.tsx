import React from "react";
import "./ProblemCard.css";
import { ProblemData } from "../../../models/getProblemsResponse";

interface ProblemCardProps {
  problemData: ProblemData;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problemData }) => {
  return (
    <main className="problem-container">
      <h1 className="problem-title">{problemData.problemName}</h1>
      <p>
        実行時間制限: {problemData.timeLimit} ms / メモリ制限:{" "}
        {problemData.memoryLimit} KB
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
