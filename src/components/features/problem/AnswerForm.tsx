import React, { useState, useCallback, useRef } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, historyKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
import { useCodeMirror } from "@uiw/react-codemirror";
// import { oneDark } from "@codemirror/theme-one-dark"; // OneDarkテーマ
import { dracula } from "@uiw/codemirror-theme-dracula"; // Draculaテーマ
import { LanguageSupport } from "@codemirror/language";
import "./AnswerForm.css"; // 追加

interface AnswerFormProps {
  onSubmit: (answer: string) => void;
  loading: boolean;
  language: string;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  onSubmit,
  loading,
  language,
}) => {
  const [code, setCode] = useState("");
  const editor = useRef<EditorView | null>(null);

  const onChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(code);
    setCode(""); // 入力フィールドをクリア
    if (editor.current) {
      editor.current.dispatch({
        changes: { from: 0, to: editor.current.state.doc.length, insert: "" },
      });
    }
  };

  // 言語モードを動的に選択
  const getLanguageMode = (): LanguageSupport | undefined => {
    switch (language) {
      case "javascript":
        return javascript();
      // 他の言語のケースを追加
      default:
        return undefined; // またはデフォルトの言語モード
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
    <section className="problem-submission">
      <h2>提出</h2>
      <form onSubmit={handleSubmit}>
        <select>
          <option>{language}</option>
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
