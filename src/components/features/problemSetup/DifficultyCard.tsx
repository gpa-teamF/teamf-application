import React from "react";
import "./DifficultyCard.css";

interface DifficultyCardProps {
  level: string; // ← ここを変更（以前は `"初級" | "中級" | "上級"` だった）
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const DifficultyCard: React.FC<DifficultyCardProps> = ({
  level,
  description,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`difficulty-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <h3>{level}</h3>
      {isSelected && <p className="difficulty-description">{description}</p>}
    </div>
  );
};

export default DifficultyCard;
