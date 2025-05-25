import React, { ReactNode } from "react";
import "./CenteredCardLayout.css";

interface CenteredCardLayoutProps {
  children: ReactNode;
}

const CenteredCardLayout: React.FC<CenteredCardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="centered-layout-wrapper">
      <div className="centered-layout-card">{children}</div>
    </div>
  );
};

export default CenteredCardLayout;
