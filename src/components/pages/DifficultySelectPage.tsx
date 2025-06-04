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
    description:
      "初級者向け\nプログラミング初心者や競技プログラミング未経験者向けの難易度です。",
  },
  {
    level: "medium",
    name: "中級",
    description:
      "中級者向け\n基本的なアルゴリズムやデータ構造にある程度慣れている方向けです。",
  },
  {
    level: "hard",
    name: "上級",
    description:
      "上級者向け\n難解な問題や高度な実装に挑戦したい方向けの難易度です。",
  },
];

const DifficultySelectPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalWidth, setModalWidth] = useState("");
  const [onModalOk, setOnModalOk] = useState<() => void>(() => {});
  const navigate = useNavigate();

  const handleStartClick = () => {
    setModalWidth("30%");
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
    setModalWidth("180%");
    setModalContent(
      "【利用方法】\n・[タイマー]：問題名の横に残り時間が表示されます。\n・[問題]：問題文や制約、入出力例などが表示されます。問題は上部のボタンで自由に切り替えられます。\n・[コード実行]：言語/ソースコード/標準入力を自由に選択/入力できます。\n・[実行]ボタン：ソースコードを入力してボタン押下するとその実行結果が表示されます。何度でも実行することができます。（不必要な実行はお控えください。）\n・[提出ボタン]：押下するとテストケースの結果とソースコードの評価が表示されます。問題ごとに1回のみ提出することができます。\n・[最終リザルトへ]ボタン：問題回答を終了し、リザルト画面を表示します。未提出の問題があってもリザルトへ進めますが、問題画面には戻れません。\n\n【判定結果】\n・[AC]：正解 / [WA]：不正解 / [TLE]：正解かつ実行時間制限超過 / [OLE]：正解かつメモリ使用量制限超過 / [RE]：実行時エラー / [CE]：コンパイルエラー\n\n【ソースコードの評価】\n・[正確性]：正答率を元に評価します。（正解したテストケースが対象）\n・[パフォーマンス]：基準値を元に実行時間とメモリ使用量から評価します。小規模なテストケースほど厳しく評価します。（全てのテストケースが対象）\n・[アルゴリズム]：基準値を元に実行時間とメモリ使用量から評価します。（正解した大規模テストケースが対象）\n・[コード品質]：Linterを用いて評価します。関数の有無、docstringの有無、エントリポイントの有無、ネストの深さ等が評価に影響します。\n・[可読性]：フォーマッタを用いて評価します。元のソースコードとフォーマット後を比較して差分が多いと減点されます。"
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
          onOk={onModalOk}
          title="確認"
          width={modalWidth}
        >
          <p>{modalContent}</p>
        </Modal>
      </CenteredCardLayout>
    </Layout>
  );
};

export default DifficultySelectPage;
