import React from "react";
import "./RuleCard.css";

interface RuleCardProps {
  onHowToUseClick: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ onHowToUseClick }) => {
  return (
    <div className="rule-card">
      <h2>ルール説明</h2>
      <p>・問題は全部で3問です。</p>
      <p>・制限時間は15分です。</p>
      <p>・表示される問題を解くソースコードを作成して提出してください。</p>
      <p>
        ・未提出の問題がある状態でリザルト画面に進むと、その問題は「未提出」として扱われます。（制限時間内に提出が完了しなかった場合も「未提出」となります。）
      </p>
      <p>・問題の提出は1回限りです。提出後は解答の変更・再提出はできません。</p>
      <p>
        ・コード実行では、作成したソースコードを何度でも試すことができます。
      </p>
      <p>
        ・提出すると、テストケースの実行結果やソースコードの体裁などから評価が行われます。
      </p>
      <p>
        ・ソースコードの評価基準は「正確性」 「パフォーマンス」 「アルゴリズム」
        「コード品質」
        「可読性」の5つです。詳しくは『利用方法を見る』でご確認ください。
      </p>
      <button className="how-to-use-button" onClick={onHowToUseClick}>
        利用方法を見る
      </button>
    </div>
  );
};

export default RuleCard;
