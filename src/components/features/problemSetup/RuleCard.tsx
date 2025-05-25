import React from "react";
import "./RuleCard.css";

interface RuleCardProps {
  onHowToUseClick: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ onHowToUseClick }) => {
  return (
    <div className="rule-card">
      <h2>ルール説明</h2>
      <p>全5問／制限時間：30分／途中で戻ることはできません。</p>
      <button className="how-to-use-button" onClick={onHowToUseClick}>
        利用方法を見る
      </button>
    </div>
  );
};

export default RuleCard;
