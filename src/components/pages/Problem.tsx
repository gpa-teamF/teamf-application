import React from "react";

interface ProblemProps {
  problemText: string;
}

const Problem: React.FC<ProblemProps> = ({ problemText }) => {
  return <p>Problem: {problemText}</p>;
};

export default Problem;
