import React from "react";
import "./DifficultyCard.css";

interface DifficultyCardProps {
  name: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const DifficultyCard: React.FC<DifficultyCardProps> = ({
  name,
  description,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`difficulty-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <h3>{name}</h3>
      {isSelected && <p className="difficulty-description">{description}</p>}
    </div>
  );
};

export default DifficultyCard;
