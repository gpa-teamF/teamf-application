import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header>
      <Link to="/">
        <h1>社内競プロアプリ</h1>
      </Link>
    </header>
  );
};

export default Header;
