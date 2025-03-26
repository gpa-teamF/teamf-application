import React, { useState } from "react";

interface AnswerFormProps {
  onSubmit: (answer: string) => void;
  loading: boolean;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ onSubmit, loading }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(answer);
    setAnswer(""); // 入力フィールドをクリア
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Answer:
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={loading} // ローディング中は入力不可
        />
      </label>
      <button type="submit" disabled={loading}>
        Submit
      </button>
    </form>
  );
};

export default AnswerForm;
