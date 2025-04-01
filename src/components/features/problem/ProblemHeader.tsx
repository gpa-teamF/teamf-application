import React from "react";
import "./ProblemHeader.css"; // 必要に応じてCSSファイルをインポート

const ProblemHeader: React.FC = () => {
  return (
    <header className="problem-header">
      <nav className="problem-nav">
        <a href="#">トップ</a>
        <a href="#">問題</a>
        <a href="#">提出</a>
        <a href="#">提出結果</a>
        <a href="#">順位</a>
      </nav>
    </header>
  );
};

export default ProblemHeader;
