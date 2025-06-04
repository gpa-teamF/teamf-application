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
    level: "easy",
    name: "初級",
    description: "プログラミング初心者 / 競技プログラミング未経験者向け",
  },
  {
    level: "medium",
    name: "中級",
    description: "基本的なアルゴリズムやデータ構造にある程度慣れている方向け",
  },
  {
    level: "hard",
    name: "上級",
    description: "難解な問題や高度な実装に挑戦したい方向け",
  },
];

const DifficultySelectPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalShowCancel, setModalShowCancel] = useState(false);
  const [modalWidth, setModalWidth] = useState("");
  const [onModalOk, setOnModalOk] = useState<() => void>(() => {});
  const navigate = useNavigate();

  const handleStartClick = () => {
    setModalTitle("開始");
    setModalWidth("30%");
    setModalShowCancel(true);
    setModalContent(
      `レベル「${
        difficulties.find((d) => d.level === selectedLevel)?.name
      }」で開始します。OK押下後にタイマーがスタートします。`
    );
    setOnModalOk(() => () => {
      setIsModalOpen(false);
      navigate("/problem", { state: { level: selectedLevel } });
    });
    setIsModalOpen(true);
  };

  const handleHowToUseClick = () => {
    setModalTitle("利用方法");
    setModalWidth("40%");
    setModalShowCancel(false);
    setModalContent(
      <>
        <ul>
          <li>タイマー：問題名の横に残り時間が表示される。</li>
          <li>
            問題：問題文や制約、入出力例などが表示される。問題は上部のボタンで自由に切り替え可能。
          </li>
          <li>
            コード実行：ソースコード/標準入力を自由に入力して実行することが可能。
          </li>
          <li>
            提出：テストケースによる正誤判定とソースコードの評価を実施。提出は問題ごとに1回のみ可能。
          </li>
          <li>
            [最終リザルトへ]ボタン：問題回答を終了してリザルト画面に進む。問題画面には戻れない。
          </li>
        </ul>
      </>
    );
    setOnModalOk(() => () => setIsModalOpen(false));
    setIsModalOpen(true);
  };

  const handleExecuteResultClick = () => {
    setModalTitle("判定結果");
    setModalWidth("30%");
    setModalShowCancel(false);
    setModalContent(
      <>
        <ul>
          <li>AC：正解</li>
          <li>WA：不正解</li>
          <li>TLE：正解かつ実行時間制限超過</li>
          <li>RE：実行時エラー</li>
          <li>CE：コンパイルエラー</li>
        </ul>
      </>
    );
    setOnModalOk(() => () => setIsModalOpen(false));
    setIsModalOpen(true);
  };

  const handleCriteriaClick = () => {
    setModalTitle("評価基準");
    setModalWidth("40%");
    setModalContent(
      <>
        <ul>
          <li>正確性（30点） ：テストケースの通過率で採点。</li>
          <li>
            パフォーマンス（25点） ：
            基準値を元に実行時間から評価。小規模なテストケースほど厳しく評価。
          </li>
          <li>
            アルゴリズム（25点） ：
            基準値を元に実行時間から評価。対象は大規模テストケース限定。
          </li>
          <li>
            コード品質（10点） ： Linterを用いて評価。関数 / docstring /
            エントリポイントなどの有無、ネストの深さなどが評価に影響。
          </li>
          <li>
            可読性（10点） ：
            フォーマッタを用いて評価。元のソースコードとフォーマット後を比較して差分が多いと減点。
          </li>
        </ul>
      </>
    );
    setOnModalOk(() => () => {
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <CenteredCardLayout>
        <RuleCard
          onHowToUseClick={handleHowToUseClick}
          onExecuteResultClick={handleExecuteResultClick}
          onCriteriaClick={handleCriteriaClick}
        />

        <div className="difficulty-select-section">
          <h2>難易度を選択してください</h2>
          {difficulties.map((diff) => (
            <DifficultyCard
              key={diff.level}
              name={diff.name}
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
          showCancelButton={modalShowCancel}
          onOk={onModalOk}
          title={modalTitle}
          width={modalWidth}
        >
          <p>{modalContent}</p>
        </Modal>
      </CenteredCardLayout>
    </Layout>
  );
};

export default DifficultySelectPage;
