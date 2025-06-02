import React from "react";
import "./SubmissionCard.css";
import { SubmitResult } from "../../../models/submitResultResponse";

interface SubmissionCardProps {
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: () => void;
  submitResult: SubmitResult | null;
}

const SubmissionResult: React.FC<SubmissionCardProps> = ({
  isSubmitting,
  isSubmitted,
  onSubmit,
  submitResult,
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "AC":
        return "status-ac";
      case "WA":
        return "status-wa";
      case "TLE":
      case "MLE":
        return "status-warning";
      case "CE":
      case "RE":
        return "status-error";
      default:
        return "";
    }
  };

  const renderStatusText = (status: string) => {
    switch (status) {
      case "AC":
        return "AC (正解)";
      case "WA":
        return "WA (不正解)";
      case "TLE":
        return "TLE (制限時間超過)";
      case "MLE":
        return "MLE (メモリ使用量超過)";
      case "CE":
        return "CE (コンパイルエラー)";
      case "RE":
        return "RE (実行時エラー)";
      default:
        return status;
    }
  };

  return (
    <main className="submission-container">
      <h2 className="submission__title">提出</h2>
      <button
        onClick={onSubmit}
        disabled={isSubmitting || isSubmitted}
        className="submit-button"
      >
        {isSubmitting ? "提出中..." : "提出"}
      </button>

      {submitResult && (
        <section>
          <div className="sub-section">
            <h3 className="submission__subtitle">テストケース結果</h3>
            <table className="submission-result-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ステータス</th>
                  <th>実行時間 (ms)</th>
                  <th>メモリ使用量 (KB)</th>
                </tr>
              </thead>
              <tbody>
                {submitResult.testResults.map((item) => (
                  <tr key={item.testcaseId}>
                    <td>{item.testcaseId}</td>
                    <td>
                      {item.status ? (
                        <span
                          className={`status-badge ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {renderStatusText(item.status)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{item.executionTime}</td>
                    <td>{item.memoryUsage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr />
          <div className="sub-section">
            <h3 className="submission__subtitle">ソースコード評価結果</h3>
            <table className="submission-result-table">
              <thead>
                <tr>
                  <th>合計得点</th>
                  <th>正確性</th>
                  <th>パフォーマンス</th>
                  <th>アルゴリズム</th>
                  <th>コード品質</th>
                  <th>可読性</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{submitResult.evaluateResult.totalScore} / 100</td>
                  <td>{submitResult.evaluateResult.correctnessScore} / 30</td>
                  <td>{submitResult.evaluateResult.performanceScore} / 25</td>
                  <td>{submitResult.evaluateResult.algorithmsScore} / 25</td>
                  <td>{submitResult.evaluateResult.codeQualityScore} / 10</td>
                  <td>{submitResult.evaluateResult.readabilityScore} / 10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default SubmissionResult;
