import React, { useState, useCallback, useRef } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, historyKeymap } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { basicSetup } from "codemirror";
import { useCodeMirror } from "@uiw/react-codemirror";
// import { oneDark } from "@codemirror/theme-one-dark"; // OneDarkテーマ
import { dracula } from "@uiw/codemirror-theme-dracula"; // Draculaテーマ
import { LanguageSupport } from "@codemirror/language";
import "./AnswerForm.css";

interface AnswerFormProps {
  onSubmit: (answer: string) => void;
  loading: boolean;
  language: string;
  onLanguageChange: (language: string) => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  onSubmit,
  loading,
  language,
  onLanguageChange,
}) => {
  const [code, setCode] = useState("");
  const editor = useRef<EditorView | null>(null);

  const onChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(code);
    // setCode(""); // 入力フィールドをクリア
    // if (editor.current) {
    //   editor.current.dispatch({
    //     changes: { from: 0, to: editor.current.state.doc.length, insert: "" },
    //   });
    // }
  };

  // 言語モードを動的に選択
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
    // theme: oneDark, // oneDark
    theme: dracula, // dracula
    extensions: extensions,
    onChange,
    onUpdate(v) {
      editor.current = v.view;
    },
  });

  return (
    <section className="problem-submission" id="submit">
      <h2>提出</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="python">Python (Python 3.12)</option>
          <option value="java">Java (OpenJDK 17)</option>
          <option value="cpp">C++</option>
        </select>
        <div ref={setContainer} /> {/* CodeMirrorを表示するコンテナ */}
        <button type="submit" disabled={loading}>
          {loading ? "提出中..." : "提出"}
        </button>
      </form>
    </section>
  );
};

export default AnswerForm;
