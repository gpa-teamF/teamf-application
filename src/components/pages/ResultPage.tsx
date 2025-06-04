import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";
import "./ResultPage.css";
import { SubmitResult } from "../../models/submitResultResponse";
import Modal from "../common/Modal";
import Layout from "../layout/Layout";
import CenteredCardLayout from "../layout/CenteredCardLayout";
import OverlayLoading from "../common/OverlayLoading";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

// Location.state の型定義
interface LocationState {
  submissionResults: Record<number, SubmitResult | null>;
}

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1) 受け取った state を型アサーションで取得
  const state = (location.state as LocationState) || null;

  // もし正しく受け取れていなければトップへ戻す
  useEffect(() => {
    if (!state || !state.submissionResults) {
      navigate("/");
    }
  }, [state, navigate]);

  // submissionResults は Record<number, SubmitResult | null> なので、
  // 問題番号のインデックス（0,1,2, ...）に対応する型
  const submissionResultsObj = state.submissionResults;

  // navigation で参照するためにキーを配列化
  const problemIndices = Object.keys(submissionResultsObj)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b);

  // プロパティ '総合' 用に -1 を割り当てる
  const TOTAL_TAB_INDEX = -1;

  // 画面内で選択中のタブ（0,1,2, ..., または -1＝総合）
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // モーダル制御用
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>("");
  const [onModalOk, setOnModalOk] = useState<() => void>(() => {});

  // ----- レーダーチャート表示用データ作成 -----

  type ChartDatum = {
    metric: string;
    score: number;
  };

  // ①：個別タブ or 総合タブで表示する evaluateResult を取得
  const getSelectedResult = (): SubmitResult | null => {
    if (selectedIndex === TOTAL_TAB_INDEX) {
      // 総合タブ：全問題の平均値をまとめた結果を仮で返す
      // Null をフィルターし、有効な SubmitResult のみを使う
      const validResults: SubmitResult[] = problemIndices
        .map((i) => submissionResultsObj[i])
        .filter((res): res is SubmitResult => res !== null);

      if (validResults.length === 0) return null;

      // 各メトリクスの平均を計算する
      const summed = validResults.reduce(
        (acc, curr) => {
          acc.correctnessScore += curr.evaluateResult.correctnessScore;
          acc.performanceScore += curr.evaluateResult.performanceScore;
          acc.algorithmsScore += curr.evaluateResult.algorithmsScore;
          acc.codeQualityScore += curr.evaluateResult.codeQualityScore;
          acc.readabilityScore += curr.evaluateResult.readabilityScore;
          // totalScore は合算で保持
          acc.totalScore += curr.evaluateResult.totalScore;
          return acc;
        },
        {
          correctnessScore: 0,
          performanceScore: 0,
          algorithmsScore: 0,
          codeQualityScore: 0,
          readabilityScore: 0,
          totalScore: 0,
        }
      );

      const count = validResults.length;
      // 平均化
      const avgEvaluate: SubmitResult["evaluateResult"] = {
        totalScore: summed.totalScore, // 総合スコアは合算
        correctnessScore: Math.round(summed.correctnessScore / count),
        performanceScore: Math.round(summed.performanceScore / count),
        algorithmsScore: Math.round(summed.algorithmsScore / count),
        codeQualityScore: Math.round(summed.codeQualityScore / count),
        readabilityScore: Math.round(summed.readabilityScore / count),
      };

      return {
        testResults: [], // 総合タブではテスト結果一覧は表示しないため空配列にしておく
        evaluateResult: avgEvaluate,
        error: "",
      };
    } else {
      // 個別タブ：当該 index の SubmitResult を返却
      const res = submissionResultsObj[selectedIndex];
      return res;
    }
  };

  const selectedResult = getSelectedResult();

  // ②：レーダーチャート用のデータ配列を作成
  //    個別 or 総合どちらも同じ形でOK
  const chartData: ChartDatum[] = selectedResult
    ? [
        {
          metric: "正確性",
          score: selectedResult.evaluateResult.correctnessScore,
        },
        {
          metric: "パフォーマンス",
          score: selectedResult.evaluateResult.performanceScore,
        },
        {
          metric: "アルゴリズム",
          score: selectedResult.evaluateResult.algorithmsScore,
        },
        {
          metric: "コード品質",
          score: selectedResult.evaluateResult.codeQualityScore,
        },
        {
          metric: "可読性",
          score: selectedResult.evaluateResult.readabilityScore,
        },
      ]
    : [];

  // ③：総合スコア & ランクを算出
  //    個別タブなら totalScore、総合タブなら合算 totalScore を使用
  const computeTotalScore = (): number => {
    if (!selectedResult) return 0;
    return selectedResult.evaluateResult.totalScore;
  };
  const totalScore = computeTotalScore();

  // ④：ランクの判定 (例として暫定しきい値を設定)
  //    総合タブ：max=300 と想定、個別タブ：max=100 と想定
  const getRank = (score: number): { label: string; color: string } => {
    const maxScore = selectedIndex === TOTAL_TAB_INDEX ? 300 : 100;
    const ratio = (score / maxScore) * 100; // パーセント
    if (ratio >= 90) return { label: "S", color: "#FFD700" }; // 金色
    if (ratio >= 80) return { label: "A", color: "#FF69B4" }; // ピンク
    if (ratio >= 70) return { label: "B", color: "#FF4500" }; // 赤オレンジ
    if (ratio >= 60) return { label: "C", color: "#FFA500" }; // オレンジ
    if (ratio >= 50) return { label: "D", color: "#FFFF00" }; // 黄
    return { label: "E", color: "#32CD32" }; // 緑
  };

  const { label: rankLabel, color: rankColor } = getRank(totalScore);

  // ----- ハンドラ類 -----

  // 「評価基準を確認」ボタン押下時
  const openCriteriaModal = () => {
    setModalTitle("評価基準");
    setModalContent(
      <>
        <p>下記のような基準で評価を行います:</p>
        <ul>
          <li>正確性 … テストケースの通過率に応じて点数を付与</li>
          <li>パフォーマンス … 実行時間の速さに応じて点数を付与</li>
          <li>アルゴリズム … 計算量・適切さを評価</li>
          <li>コード品質 … コメントや命名規則・構造の良さを評価</li>
          <li>可読性 … 可読性・一貫性・可維持性を評価</li>
        </ul>
      </>
    );
    setOnModalOk(() => () => {
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  // 個別タブ選択時に、該当問題が null (未提出) ならグレーアウトと中身「未提出」を表示
  const isUnsubmitted = (index: number) => {
    return submissionResultsObj[index] === null;
  };

  // 各問題タブ or 総合タブをクリックしたとき
  const handleTabClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Layout>
      <CenteredCardLayout>
        <OverlayLoading isLoading={false} size={100} />
        <div className="result-container">
          <h1>最終結果</h1>

          {/* ── ナビゲーションボタン（問題1～N と 総合）── */}
          <div className="navigation">
            {/* 総合タブ */}
            <button
              key="total"
              onClick={() => handleTabClick(TOTAL_TAB_INDEX)}
              className={`nav-button ${
                selectedIndex === TOTAL_TAB_INDEX ? "active" : ""
              }`}
            >
              総合
            </button>
            {problemIndices.map((idx) => (
              <button
                key={idx}
                onClick={() => handleTabClick(idx)}
                className={`nav-button ${
                  selectedIndex === idx ? "active" : ""
                } ${isUnsubmitted(idx) ? "unsubmitted" : ""}`}
              >
                {`問題 ${idx + 1}`}
                {isUnsubmitted(idx) && (
                  <span className="unsubmitted-text">未提出</span>
                )}
              </button>
            ))}
          </div>

          {/* ── メインコンテンツ ── */}
          <div className="main-content">
            {/* 左側：スコア & ランク */}
            <div className="score-box">
              {selectedResult ? (
                <>
                  <h2>スコア</h2>
                  <p className="score-value">
                    {totalScore}
                    <span className="score-max">
                      /{selectedIndex === TOTAL_TAB_INDEX ? 300 : 100}
                    </span>
                  </p>

                  <p className="rank-text" style={{ color: rankColor }}>
                    {rankLabel}
                  </p>
                </>
              ) : (
                <div className="no-result">
                  <p>この問題は未提出です。</p>
                </div>
              )}

              {/* 評価基準確認ボタン */}
              <button className="criteria-button" onClick={openCriteriaModal}>
                評価基準を確認
              </button>
            </div>

            {/* 右側：レーダーチャート */}
            <div className="chart-wrapper">
              {selectedResult ? (
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  width={300}
                  height={300}
                  data={chartData}
                >
                  <PolarGrid stroke="#444" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "#ccc", fontSize: 12 }}
                    // ※RechartsではAxisラベル自体にツールチップをつける機能は難しく、
                    //  tickFormatter などで名称を変える程度になります。
                    // ここではそのまま「metric」の文字列を表示しています。
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#666", fontSize: 10 }}
                    // 値の表示位置を少し外側にずらすために axisLine や tickLine をスタイル調整できます。
                  />
                  <Radar
                    name="スコア"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    formatter={(
                      value: number | string,
                      _name: string,
                      item?: Payload<string | number, string> // 省略可能にする
                    ) => {
                      // payload が存在するか安全にチェック
                      const metric =
                        item?.payload &&
                        (item.payload as { metric?: string }).metric;
                      return [`${value}`, metric ?? ""]; // metric がなければ空文字
                    }}
                  />
                </RadarChart>
              ) : (
                <div className="no-chart">
                  提出がないためチャートは表示できません。
                </div>
              )}
            </div>
          </div>

          {/* ── テストケース結果テーブル ── */}
          <h2 className="table-heading">テストケース結果</h2>
          <div className="table-wrapper">
            <table className="test-result-table">
              <thead>
                <tr>
                  <th className="sticky-col-left">ID</th>
                  <th>結果</th>
                  <th>実行時間 (ms)</th>
                  <th>メモリ (KB)</th>
                  <th className="sticky-col-right">備考</th>
                </tr>
              </thead>
              <tbody>
                {selectedResult && selectedResult.testResults.length > 0 ? (
                  selectedResult.testResults.map((res) => (
                    <tr key={res.testcaseId}>
                      <td className="sticky-col-left">{res.testcaseId}</td>
                      <td>{res.status}</td>
                      <td>{res.executionTime}</td>
                      <td>{res.memoryUsage}</td>
                      <td className="sticky-col-right">
                        {res.status !== "AC" ? "要修正" : "OK"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>テスト結果がありません。</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── アンケートリンク ── */}
          <div className="survey-box">
            <p>
              ご使用いただきありがとうございました。最後に
              <a
                href="https://forms.office.com/r/WnETkdq087?origin=lprLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                アンケート
              </a>
              にご協力ください！
            </p>
          </div>

          {/* ── 戻るボタン ── */}
          <div className="button-row">
            <button className="back-button" onClick={() => navigate("/")}>
              ホームに戻る
            </button>
          </div>

          {/* ── モーダル（確認ダイアログ／評価基準ダイアログ）── */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onOk={onModalOk}
            showCancelButton={false}
            title={modalTitle}
          >
            {modalContent}
          </Modal>
        </div>
      </CenteredCardLayout>
    </Layout>
  );
};

export default ResultPage;
