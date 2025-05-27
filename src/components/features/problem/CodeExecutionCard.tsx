import React, { useState, useCallback, useRef } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, historyKeymap } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { basicSetup } from "codemirror";
import { useCodeMirror } from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { LanguageSupport } from "@codemirror/language";
import "./CodeExecutionCard.css";
import { ExecuteCodeResponse } from "../../../models/executeCodeResponse";

interface CodeExecutionCardProps {
  onExecute: (code: string, stdin: string) => void;
  loading: boolean;
  language: string;
  onLanguageChange: (lang: string) => void;
  executionResult?: ExecuteCodeResponse;
}

const CodeExecutionCard: React.FC<CodeExecutionCardProps> = ({
  onExecute,
  loading,
  language,
  onLanguageChange,
  executionResult,
}) => {
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const editor = useRef<EditorView | null>(null);

  const onChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleExecute = (event: React.FormEvent) => {
    event.preventDefault();
    onExecute(code, stdin);
  };

  const getLanguageMode = (): LanguageSupport | undefined => {
    switch (language) {
      case "python":
        return python();
      case "java":
        return java();
      case "cpp":
        return cpp();
      default:
        return undefined;
    }
  };

  const languageMode = getLanguageMode();

  const extensions = [
    basicSetup,
    keymap.of([...defaultKeymap, ...historyKeymap]),
    EditorView.lineWrapping,
  ];

  if (languageMode) {
    extensions.push(languageMode);
  }

  const { setContainer } = useCodeMirror({
    value: code,
    height: "200px",
    theme: dracula,
    extensions: extensions,
    onChange,
    onUpdate(v) {
      editor.current = v.view;
    },
  });

  const hasError =
    executionResult?.stderr && executionResult.stderr.trim() !== "";

  return (
    <main>
      <section className="code-execution">
        <h2 className="code-execution__title">コード実行</h2>
        <form onSubmit={handleExecute} className="code-execution__form">
          <div className="sub-section">
            <h3 className="code-execution__subtitle">言語</h3>
            <select
              className="language-select"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              <option value="python">Python (Python 3.12)</option>
              <option value="java">Java (OpenJDK 17)</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div className="sub-section">
            <h3 className="code-execution__subtitle">ソースコード</h3>
            <div ref={setContainer} className="code-execution__editor" />
          </div>

          <div className="sub-section">
            <h3 className="code-execution__subtitle">標準入力</h3>
            <textarea
              className="stdin-box__textarea"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="例：1 2"
            />
          </div>

          <div className="sub-section">
            <button
              type="submit"
              disabled={loading}
              className="code-execution__button"
            >
              {loading ? "実行中..." : "実行"}
            </button>
          </div>
        </form>
      </section>
      <section className="code-execution">
        <h2 className="code-execution__title">実行結果</h2>
        <div className="sub-section">
          <table className="result-table">
            <tbody>
              <tr>
                <th>終了コード</th>
                <td className={hasError ? "result-table__cell--error" : ""}>
                  {executionResult?.exitCode ?? "-"}
                </td>
              </tr>
              <tr>
                <th>実行時間</th>
                <td>
                  {executionResult?.executionTime != null
                    ? `${executionResult.executionTime} ms`
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>メモリ使用量</th>
                <td>
                  {executionResult?.memoryUsage != null
                    ? `${executionResult.memoryUsage} KB`
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
              executionResult?.stdout || "",
              executionResult?.stderr || "",
            ].join("\n")}
          />
        </div>
      </section>
    </main>
  );
};

export default CodeExecutionCard;
