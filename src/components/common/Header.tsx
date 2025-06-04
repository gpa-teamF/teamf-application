import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/">
        <div className="header-container">
          <img src="src/assets/logo.png" alt="Logo" className="logo-img" />
          <h1 className="apl-ttl">競プロくん</h1>
        </div>
      </Link>
    </header>
  );
};

export default Header;
