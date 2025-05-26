import React from "react";
import "./Problem.css";

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
    <main className="problem-content" id="problem">
      <section className="">{timeLimit}</section>
      <section className="">{memoryLimit}</section>
      <section className="">
        <h1>{problemName}</h1>
      </section>

      <section className="problem-description">
        <h2>問題文</h2>
        <p>{problemText}</p>
      </section>

      {constraints && (
        <section className="problem-constraints">
          <h2>制約</h2>
          <p>{constraints}</p>
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
