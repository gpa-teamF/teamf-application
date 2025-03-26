import { useState, useEffect } from "react";
import "./App.css";
import Problem from "./components/pages/Problem";
import AnswerForm from "./components/pages/AnswerForm";
import Layout from "./components/layout/Layout";
import useApi from "./hooks/useApi";
import { getProblemResponseBody } from "./models/getProblemResponse";
import { judgeAnswerResponseBody } from "./models/judgeAnswerResponse";

function App() {
  const [problemText, setProblemText] = useState<string>("");
  const [problemId, setProblemId] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [message, setMessage] = useState<string | undefined>(undefined);

  const {
    data: problemData,
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

  useEffect(() => {
    fetchProblem("/problem", "get");
  }, [fetchProblem]);

  useEffect(() => {
    if (problemData) {
      setProblemText(problemData.body.problemId);
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

  useEffect(() => {
    if (answerData) {
      setResult(answerData.body.result ? "Correct!" : "Incorrect...");
      setMessage(answerData.message);
    }
  }, [answerData]);

  useEffect(() => {
    if (answerError) {
      setMessage(answerError);
    }
  }, [answerError]);

  return (
    <Layout>
      {problemLoading ? (
        <p>Loading problem...</p>
      ) : problemError ? (
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
}

export default App;
