import React, { useState } from "react";
import Problem from "../features/problem/Problem";
import AnswerForm from "../features/problem/AnswerForm";
import Layout from "../layout/Layout";
import useApi from "../../hooks/useApi";
import { getProblemResponseBody } from "../../models/getProblemResponse";
import { judgeAnswerResponseBody } from "../../models/judgeAnswerResponse";
import OverlayLoading from "../common/OverlayLoading";
import "./ProblemPage.css";
import ProblemHeader from "../features/problem/ProblemHeader"; // ProblemHeaderコンポーネントをインポート

const ProblemPage: React.FC = () => {
  const [problemData, setProblemData] = useState<getProblemResponseBody | null>(
    null
  );
  const [result, setResult] = useState<string>("");
  const [message, setMessage] = useState<string | undefined>(undefined);

  const [language] = useState<string>("javascript"); // 追加: 言語の状態

  const {
    data: problemDataResponse,
    error: problemError,
    loading: problemLoading,
    fetchData: fetchProblem,
  } = useApi<getProblemResponseBody>();
  const {
    data: answerData,
    error: answerError,
    loading: answerLoading,
    fetchData: fetchAnswer,
  } = useApi<judgeAnswerResponseBody>();

  React.useEffect(() => {
    fetchProblem("/problem", "get");
  }, [fetchProblem]);

  React.useEffect(() => {
    if (problemDataResponse) {
      setProblemData(problemDataResponse.body);
    }
  }, [problemDataResponse]);

  const handleAnswerSubmit = async (answer: string) => {
    setResult("提出中...");
    setMessage(undefined);

    if (problemData) {
      await fetchAnswer("/answer", "post", {
        data: {
          answer: answer,
          problemId: problemData.problemId,
        },
      });
    }
  };

  React.useEffect(() => {
    if (answerData) {
      setResult(answerData.body.result ? "正解!" : "不正解...");
      setMessage(answerData.message);
    }
  }, [answerData]);

  React.useEffect(() => {
    if (answerError) {
      setMessage(answerError);
    }
  }, [answerError]);

  return (
    <Layout>
      <OverlayLoading isLoading={problemLoading || answerLoading} size={100} />
      <ProblemHeader />
      {problemError ? (
        <p>Error: {problemError}</p>
      ) : (
        <>
          {problemData && (
            <Problem
              problemName={problemData.problemName}
              problemText={problemData.problemText}
              constraints={problemData.constraints}
              inputFormat={problemData.inputFormat}
              outputFormat={problemData.outputFormat}
              inputExamples={problemData.inputExamples}
              outputExamples={problemData.outputExamples}
            />
          )}
          <AnswerForm
            onSubmit={handleAnswerSubmit}
            loading={answerLoading}
            language={language}
          />{" "}
          {/* 修正箇所 */}
          <p>Result: {result}</p>
          {message && <p>Message: {message}</p>}
        </>
      )}
    </Layout>
  );
};

export default ProblemPage;
