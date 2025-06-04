import React from "react";
import "./ProblemNavigationCard.css";
import { ProblemData } from "../../../models/getProblemsResponse";

interface Props {
  currentIndex: number;
  problems: ProblemData[];
  onSelectProblem: (index: number) => void;
  onClickResult: () => void;
}

const ProblemNavigationCard: React.FC<Props> = ({
  currentIndex,
  problems,
  onSelectProblem,
  onClickResult,
}) => {
  return (
    <main className="problem-navigation">
      <div className="problem-buttons">
        {problems.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelectProblem(index)}
            className={`problem-button ${
              currentIndex === index ? "active" : ""
            }`}
          >
            問題{index + 1}
          </button>
        ))}
      </div>
      <button className="result-button" onClick={onClickResult}>
        最終リザルトへ
      </button>
    </main>
  );
};

export default ProblemNavigationCard;
