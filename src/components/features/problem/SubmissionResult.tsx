import React from "react";
import "./SubmissionResult.css";
import {
  testResults,
  evaluateResult,
} from "../../../models/evaluateCodeResponse";

interface submissionResultProps {
  isSubmitting: boolean;
  testResults: testResults;
  evaluateResult: evaluateResult | null;
  onSubmit: () => void;
  isSubmitted: boolean;
}

const SubmissionResult: React.FC<submissionResultProps> = ({
  isSubmitting,
  testResults,
  evaluateResult,
  onSubmit,
  isSubmitted,
}) => {
  return (
    <main className="submission-section">
      <h3>提出</h3>
      <button
        onClick={onSubmit}
        disabled={isSubmitting || isSubmitted}
        className="submit-button"
      >
        {isSubmitting ? "提出中..." : "提出"}
      </button>

      {testResults && (
        <section>
          <table className="submission-result-table">
            <thead>
              <tr>
                <th>テストケース</th>
                <th>結果</th>
                <th>実行時間 (ms)</th>
                <th>メモリ使用量 (KB)</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((item) => (
                <tr key={item.testcaseId}>
                  <td>{item.testcaseId}</td>
                  <td>{item.status}</td>
                  <td>{item.executionTime}</td>
                  <td>{item.memoryUsage}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr></hr>
          <table className="submission-result-table">
            <thead>
              <tr>
                <th>得点</th>
                <th>正確性</th>
                <th>パフォーマンス</th>
                <th>アルゴリズム</th>
                <th>コード品質</th>
                <th>可読性</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{evaluateResult?.totalScore}</td>
                <td>{evaluateResult?.correctnessScore}</td>
                <td>{evaluateResult?.performanceScore}</td>
                <td>{evaluateResult?.algorithmsScore}</td>
                <td>{evaluateResult?.codeQualityScore}</td>
                <td>{evaluateResult?.readabilityScore}</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
};

export default SubmissionResult;
