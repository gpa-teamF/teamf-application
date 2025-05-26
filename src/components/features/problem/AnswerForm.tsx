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
import "./AnswerForm.css";
import { ExecuteCodeResponse } from "../../../models/executeCodeResponse";

interface AnswerFormProps {
  onExecute: (code: string, stdin: string) => void;
  loading: boolean;
  language: string;
  onLanguageChange: (language: string) => void;
  executionResult: ExecuteCodeResponse | null;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
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

  return (
    <section className="problem-submission" id="submit">
      <h2>コード実行</h2>
      <form onSubmit={handleExecute}>
        <label className="block mb-2">
          使用言語：
          <select
            className="ml-2"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="python">Python (Python 3.12)</option>
            <option value="java">Java (OpenJDK 17)</option>
            <option value="cpp">C++</option>
          </select>
        </label>

        <div ref={setContainer} className="mb-4" />

        <label className="block mb-4">
          標準入力（任意）:
          <textarea
            className="w-full mt-1 p-2 border rounded"
            rows={4}
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="標準入力をここに記入（例：1 2）"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "実行中..." : "実行"}
        </button>
      </form>

      {executionResult && (
        <section className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">💡 実行結果</h3>

          <table className="result-table mb-4">
            <tbody>
              <tr>
                <th>終了コード</th>
                <td>{executionResult.exitCode}</td>
              </tr>
              <tr>
                <th>実行時間</th>
                <td>
                  {executionResult.executionTime !== null
                    ? `${executionResult.executionTime} ms`
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>メモリ使用量</th>
                <td>
                  {executionResult.memoryUsage !== null
                    ? `${executionResult.memoryUsage} KB`
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="output-box mb-4">
            <h4 className="font-semibold">標準出力</h4>
            <textarea
              className="output-textarea"
              readOnly
              value={executionResult.stdout || ""}
            />
          </div>

          {executionResult.stderr && (
            <div className="output-box">
              <h4 className="font-semibold text-red-600">標準エラー出力</h4>
              <textarea
                className="output-textarea text-red-600"
                readOnly
                value={executionResult.stderr}
              />
            </div>
          )}
        </section>
      )}
    </section>
  );
};

export default AnswerForm;
