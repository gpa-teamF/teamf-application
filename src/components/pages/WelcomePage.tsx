import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/problem"); // 問題画面ページへの遷移
  };

  return (
    <Layout>
      {" "}
      {/* Layout コンポーネントでラップ */}
      <div>
        <h1>ようこそ！</h1>
        <p>社内競プロアプリへようこそ！</p>
        <button onClick={handleStartClick}>スタート</button>
      </div>
    </Layout>
  );
};

export default Welcome;
