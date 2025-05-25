import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import "./WelcomePage.css";
import CenteredCardLayout from "../layout/CenteredCardLayout";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleAcceptClick = () => {
    navigate("/difficultySelect"); // 問題画面ページへの遷移
  };

  return (
    <Layout>
      <CenteredCardLayout>
        <h1>ようこそ</h1>
        <div className="introduction-box">
          <h2 className="welcome-title">はじめに</h2>

          <p className="welcome-note">
            ※このアプリを利用する前に、以下の内容を必ずご一読ください。
            <br />
            内容をご理解いただけましたら、ページ下部の「
            <strong>利用を開始する</strong>
            」ボタンを押して次にお進みください。
          </p>

          <div className="welcome-section">
            <h3 className="welcome-subtitle">アプリの目的</h3>
            <p className="welcome-paragraph">
              <li>競技プログラミングを始めるきっかけを提供する。</li>
              <li>
                設計/PGスキルを可視化・向上させるという観点から、本アプリの有用性を検証する。
              </li>
            </p>
          </div>

          <div className="welcome-section">
            <h3 className="welcome-subtitle">セキュリティに関して</h3>
            <p className="welcome-paragraph">
              本アプリは簡易的な仕組みで動作しており、セキュリティ面に完璧な対策が施されているわけではありません。
              <br />
              悪意のあるコード（無限ループ、OS破壊コマンドなど）の送信は
              <span className="danger-text">絶対に行わないでください</span>。
            </p>
          </div>

          <div className="welcome-section">
            <h3 className="welcome-subtitle">模範解答について</h3>
            <p className="welcome-paragraph">
              模範解答はご用意しておりませんが、すべての問題は解くことができることを確認済みです。あらかじめご了承ください。
            </p>
          </div>

          <div className="welcome-section">
            <h3 className="welcome-subtitle">ご意見・不具合のご報告について</h3>
            <p className="welcome-paragraph">
              本アプリは簡易的な実装のため、問題不備や不具合などが含まれている可能性があります。
              <br />
              ご利用中にご不便をおかけすることがあるかもしれません。あらかじめお詫び申し上げます。
              <br />
              ご意見・不具合のご報告については、以下のフォームより詳細をご連絡いただけますと幸いです。
              <br />{" "}
              <a
                href="https://forms.office.com/your-form-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                フィードバックフォーム（Microsoft Forms）
              </a>
            </p>
          </div>
        </div>
        <button className="accept-button" onClick={handleAcceptClick}>
          利用を開始する
        </button>
      </CenteredCardLayout>
    </Layout>
  );
};

export default Welcome;
