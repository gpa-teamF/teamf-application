import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import "./DifficultySelectPage.css";
import Layout from "../layout/Layout";
import RuleCard from "../features/problemSetup/RuleCard";
import DifficultyCard from "../features/problemSetup/DifficultyCard";
import CenteredCardLayout from "../layout/CenteredCardLayout";

const difficulties = [
  {
    level: "初級",
    description:
      "プログラミング初心者や競技プログラミング未経験者向けの難易度です。",
  },
  {
    level: "中級",
    description:
      "基本的なアルゴリズムやデータ構造にある程度慣れている方向けです。",
  },
  {
    level: "上級",
    description: "難解な問題や高度な実装に挑戦したい方向けの難易度です。",
  },
];

const DifficultySelectPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState("初級");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [onModalOk, setOnModalOk] = useState<() => void>(() => {});
  const navigate = useNavigate();

  const handleStartClick = () => {
    setModalContent(`レベル：${selectedLevel} で開始します。よろしいですか？`);
    setOnModalOk(() => () => {
      setIsModalOpen(false);
      navigate("/problem", { state: { level: selectedLevel } });
    });
    setIsModalOpen(true);
  };

  const handleHowToUseClick = () => {
    setModalContent(
      `【利用方法】\n\n・言語選択: プルダウンにて選択\n・実行: 対象コードを実行ボタンで答え合わせ\n・提出: 答え合わせ後に提出ボタン\n・問題切り替え: 画面上部のタブにて切り替え`
    );
    setOnModalOk(() => () => setIsModalOpen(false));
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <CenteredCardLayout>
        <RuleCard onHowToUseClick={handleHowToUseClick} />

        <div className="difficulty-select-section">
          <h2>難易度を選択してください</h2>
          {difficulties.map((diff) => (
            <DifficultyCard
              key={diff.level}
              level={diff.level}
              description={diff.description}
              isSelected={selectedLevel === diff.level}
              onClick={() => setSelectedLevel(diff.level)}
            />
          ))}
        </div>

        <div className="start-button-container">
          <button className="start-button" onClick={handleStartClick}>
            スタート
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOk={onModalOk}
          title="確認"
        >
          <p>{modalContent}</p>
        </Modal>
      </CenteredCardLayout>
    </Layout>
  );
};

export default DifficultySelectPage;
