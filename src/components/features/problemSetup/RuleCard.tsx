import React from "react";
import "./RuleCard.css";

interface RuleCardProps {
  onHowToUseClick: () => void;
  onExecuteResultClick: () => void;
  onCriteriaClick: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({
  onHowToUseClick,
  onExecuteResultClick,
  onCriteriaClick,
}) => {
  return (
    <div className="rule-card">
      <h2>ルール説明</h2>
      <ul>
        <li>問題は全部で3問です。</li>
        <li>制限時間は15分です。</li>
        <li>
          表示される問題を効率良く解くソースコードを作成して提出してください。
        </li>
        <li>使用可能言語はPythonのみです。</li>
        <li>提出は1回限りです。提出後は解答の変更・再提出はできません。</li>
        <li>
          未提出の問題がある状態でリザルト画面に進むと、その問題は「未提出」として扱われます。
          <br />
          （制限時間内に提出が完了しなかった場合も「未提出」となります。）
        </li>
        <li>
          コード実行では、作成したソースコードを何度でも試すことができます。
        </li>
        <li>
          提出すると、テストケースの実行結果やソースコードの体裁などから評価が行われます。
        </li>
      </ul>
      <div className="button-container">
        <button className="how-to-use-button" onClick={onHowToUseClick}>
          利用方法を確認
        </button>
        <button className="how-to-use-button" onClick={onExecuteResultClick}>
          判定結果を確認
        </button>
        <button className="how-to-use-button" onClick={onCriteriaClick}>
          評価基準を確認
        </button>
      </div>
    </div>
  );
};

export default RuleCard;
