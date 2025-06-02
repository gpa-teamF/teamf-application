import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import "./CodeExecutionCard.css";
import { ProblemState } from "../../../models/problemState";

export interface CodeExecutionCardProps {
  loading: boolean;
  isSubmitting: boolean;
  isSubmitted?: boolean;
  currentState: ProblemState;
  onCodeChange: (code: string) => void;
  onStdinChange: (stdin: string) => void;
  onLanguageChange: (lang: string) => void;
  onExecute: (code: string, stdin: string) => void;
}

const CodeExecutionCard: React.FC<CodeExecutionCardProps> = ({
  loading,
  isSubmitting,
  isSubmitted,
  currentState,
  onCodeChange,
  onStdinChange,
  onLanguageChange,
  onExecute,
}) => {
  const getLanguageMode = () => {
    switch (currentState.language) {
      case "python":
        return python();
      case "java":
        return java();
      case "cpp":
        return cpp();
      default:
        return python();
    }
  };

  const handleCodeChange = (value: string) => {
    onCodeChange(value);
  };

  const handleStdinChange = (value: string) => {
    onStdinChange(value);
  };

  const handleLanguageChange = (lang: string) => {
    onLanguageChange(lang);
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    onExecute(currentState.code, currentState.stdin);
  };

  const hasError =
    currentState.executionResult?.stderr &&
    currentState.executionResult.stderr.trim() !== "";

  const getStatusClass = (status: string) => {
    switch (status) {
      case "OK":
        return "status-ok";
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
      case "OK":
        return "OK (正常終了)";
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
    <main className="code-execution">
      <section>
        <h2 className="code-execution__title">コード実行</h2>
        <form onSubmit={handleExecute} className="code-execution__form">
          <div className="sub-section">
            <h3 className="code-execution__subtitle">言語</h3>
            <select
              className="language-select"
              value={currentState.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isSubmitted}
            >
              <option value="python">Python (Python 3.12)</option>
              <option value="java">Java (Amazon Corretto 17)</option>
              <option value="cpp">C++17 (GCC 11)</option>
            </select>
          </div>

          <div className="sub-section">
            <h3 className="code-execution__subtitle">ソースコード</h3>
            <CodeMirror
              className="code-execution__editor"
              value={currentState.code}
              theme={dracula}
              height="100%"
              extensions={[getLanguageMode()]}
              onChange={handleCodeChange}
              editable={!isSubmitted}
            />
          </div>

          <div className="sub-section">
            <h3 className="code-execution__subtitle">標準入力</h3>
            <textarea
              className="stdin-box__textarea"
              value={currentState.stdin}
              onChange={(e) => handleStdinChange(e.target.value)}
              placeholder="例：1 2"
              disabled={isSubmitted}
            />
          </div>

          <div className="sub-section">
            <button
              type="submit"
              disabled={loading || isSubmitting || isSubmitted}
              className="code-execution__button"
            >
              {loading ? "実行中..." : "実行"}
            </button>
          </div>
        </form>
      </section>
      <hr />

      <section>
        <h2 className="code-execution__title">実行結果</h2>
        <div className="sub-section">
          <table className="result-table">
            <tbody>
              <tr>
                <th>終了コード</th>
                <td className={hasError ? "result-table__cell--error" : ""}>
                  {currentState.executionResult?.exitCode ?? "-"}
                </td>
              </tr>
              <tr>
                <th>ステータス</th>
                <td>
                  {currentState.executionResult?.status ? (
                    <span
                      className={`status-badge ${getStatusClass(
                        currentState.executionResult.status
                      )}`}
                    >
                      {renderStatusText(currentState.executionResult.status)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
              <tr>
                <th>実行時間 (ms)</th>
                <td>
                  {currentState.executionResult?.executionTimeMs != null
                    ? `${currentState.executionResult.executionTimeMs} ms`
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>メモリ使用量 (KB)</th>
                <td>
                  {currentState.executionResult?.memoryUsageKb != null
                    ? `${currentState.executionResult.memoryUsageKb} KB`
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sub-section">
          <h3 className="code-execution__subtitle">出力</h3>
          <textarea
            className={
              hasError
                ? "output-box__textarea output-box__textarea--error"
                : "output-box__textarea"
            }
            readOnly
            value={[
              currentState.executionResult?.stdout,
              currentState.executionResult?.stderr,
              currentState.executionResult?.error,
            ]
              .filter((v) => v && v.trim() !== "")
              .join("\n")}
          />
        </div>
      </section>

      {currentState.submitResult && (
        <section>
          <h2 className="code-execution__title">提出結果</h2>
          <div className="sub-section">
            <table className="result-table">
              <tbody>
                <tr>
                  <th>合計スコア</th>
                  <td>{currentState.submitResult.evaluateResult.totalScore}</td>
                </tr>
                <tr>
                  <th>正答率</th>
                  <td>
                    {currentState.submitResult.evaluateResult.correctnessScore}
                  </td>
                </tr>
                <tr>
                  <th>パフォーマンス</th>
                  <td>
                    {currentState.submitResult.evaluateResult.performanceScore}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default CodeExecutionCard;
