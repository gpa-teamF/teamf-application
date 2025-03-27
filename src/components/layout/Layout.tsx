import React from "react";
import Header from "../common/Header"; // Header コンポーネントをインポート

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="App">
      <Header /> {/* Header コンポーネントを表示 */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
