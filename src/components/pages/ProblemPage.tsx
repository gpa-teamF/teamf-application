import React from "react";
import Problem from "../features/problem/Problem";
import AnswerForm from "../features/problem/AnswerForm";
import Layout from "../layout/Layout";
import useApi from "../../hooks/useApi";
import { getProblemResponseBody } from "../../models/getProblemResponse";
import { judgeAnswerResponseBody } from "../../models/judgeAnswerResponse";
import OverlayLoading from "../common/OverlayLoading"; // OverlayLoading コンポーネントをインポート

const ProblemPage: React.FC = () => {
  const [problemText, setProblemText] = React.useState<string>("");
  const [problemId, setProblemId] = React.useState<string>("");
  const [result, setResult] = React.useState<string>("");
  const [message, setMessage] = React.useState<string | undefined>(undefined);

  const {
    data: problemData,
    error: problemError,
    // loading: problemLoading,
    fetchData: fetchProblem,
    showLoading: showProblemLoading,
  } = useApi<getProblemResponseBody>();
  const {
    data: answerData,
    error: answerError,
    loading: answerLoading,
    fetchData: fetchAnswer,
    showLoading: showAnswerLoading,
  } = useApi<judgeAnswerResponseBody>();

  React.useEffect(() => {
    fetchProblem("/problem", "get");
  }, [fetchProblem]);

  React.useEffect(() => {
    if (problemData) {
      setProblemText(problemData.body.problemText);
      setProblemId(problemData.body.problemId);
    }
  }, [problemData]);

  const handleAnswerSubmit = async (answer: string) => {
    setResult("Submitting...");
    setMessage(undefined);

    await fetchAnswer("/answer", "post", {
      data: {
        answer: answer,
        problemId: problemId,
      },
    });
  };

  React.useEffect(() => {
    if (answerData) {
      setResult(answerData.body.result ? "Correct!" : "Incorrect...");
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
      <OverlayLoading
        isLoading={showProblemLoading || showAnswerLoading}
        color="#5bc0de"
      />{" "}
      {problemError ? (
        <p>Error: {problemError}</p>
      ) : (
        <>
          <Problem problemText={problemText} />
          <AnswerForm onSubmit={handleAnswerSubmit} loading={answerLoading} />
          <p>Result: {result}</p>
          {message && <p>Message: {message}</p>}
        </>
      )}
    </Layout>
  );
};

export default ProblemPage;
