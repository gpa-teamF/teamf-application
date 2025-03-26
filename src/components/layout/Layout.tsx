import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="App">
      <h1>社内競プロアプリ</h1>
      {children}
    </div>
  );
};

export default Layout;
