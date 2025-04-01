import React from "react";
import "./Problem.css";

interface ProblemProps {
  problemName?: string; // オプション
  problemText: string;
  constraints?: string[]; // オプション
  inputFormat?: string; // オプション
  outputFormat?: string; // オプション
  inputExamples?: string[]; // オプション
  outputExamples?: string[]; // オプション
}

const Problem: React.FC<ProblemProps> = ({
  problemName,
  problemText,
  constraints,
  inputFormat,
  outputFormat,
  inputExamples,
  outputExamples,
}) => {
  return (
    <main className="problem-content">
      <section className="problem-description">
        <h2>{problemName}</h2>
      </section>
      <section className="problem-description">
        <h2>問題文</h2>
        <p>{problemText}</p>
      </section>

      {constraints && (
        <section className="problem-constraints">
          <h2>制約</h2>
          <ul>
            {constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </section>
      )}

      {inputFormat && (
        <section className="problem-input">
          <h2>入力</h2>
          <p>{inputFormat}</p>
        </section>
      )}

      {outputFormat && (
        <section className="problem-output">
          <h2>出力</h2>
          <p>{outputFormat}</p>
        </section>
      )}

      {inputExamples && outputExamples && (
        <section className="problem-examples">
          <h2>入力例</h2>
          {inputExamples.map((example, index) => (
            <div key={index} className="example-container">
              <h3>入力例 {index + 1}</h3>
              <div className="example-code">{example}</div>
              <h3>出力例 {index + 1}</h3>
              <div className="example-code">{outputExamples[index]}</div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default Problem;
