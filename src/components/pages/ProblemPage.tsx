import React, { useState, useEffect } from "react";
import Problem from "../features/problem/Problem";
import AnswerForm from "../features/problem/AnswerForm";
import Layout from "../layout/Layout";
import useApi from "../../hooks/useApi";
import {
  getMultipleProblemResponseBody,
  getProblemResponseBody,
} from "../../models/getProblemResponse";
import { judgeAnswerResponseBody } from "../../models/judgeAnswerResponse";
import OverlayLoading from "../common/OverlayLoading";
import { useLocation } from "react-router-dom";
import CenteredCardLayout from "../layout/CenteredCardLayout";
import "./ProblemPage.css";

const ProblemPage: React.FC = () => {
  const location = useLocation();
  const { level } = location.state || {};
  const [problems, setProblems] = useState<getProblemResponseBody[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<string>("");
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("python");

  const {
    data: problemDataResponse,
    error: problemError,
    loading: problemLoading,
    fetchData: fetchProblem,
  } = useApi<getMultipleProblemResponseBody>();

  const {
    data: answerData,
    error: answerError,
    loading: answerLoading,
    fetchData: fetchAnswer,
  } = useApi<judgeAnswerResponseBody>();

  useEffect(() => {
    if (level) {
      fetchProblem("/problem", "get", {
        params: {
          difficulty: level,
          count: 3,
        },
      });
    }
  }, [fetchProblem, level]);

  useEffect(() => {
    console.log("Fetched problemDataResponse:", problemDataResponse);
    if (problemDataResponse) {
      setProblems(problemDataResponse.body);
    }
  }, [problemDataResponse]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleAnswerSubmit = async (answer: string) => {
    setShowResult(true);
    setResult("提出中...");
    setMessage(undefined);

    const currentProblem = problems[currentIndex];
    if (currentProblem) {
      await fetchAnswer("/answer", "post", {
        data: {
          answer: answer,
          problemId: currentProblem.problemId,
          language: language,
        },
      });
    }
  };

  useEffect(() => {
    if (answerData) {
      setResult(answerData.body.result ? "正解!" : "不正解...");
      setMessage(answerData.message);
    }
  }, [answerData]);

  useEffect(() => {
    if (answerError) {
      setMessage(answerError);
    }
  }, [answerError]);

  const handleNext = () => {
    setShowResult(false);
    setResult("");
    setMessage(undefined);
    setCurrentIndex((prev) => Math.min(prev + 1, problems.length - 1));
  };

  const handleSelectIndex = (index: number) => {
    setShowResult(false);
    setResult("");
    setMessage(undefined);
    setCurrentIndex(index);
  };

  const currentProblem = problems[currentIndex];
  const resultClass =
    result === "正解!"
      ? "result correct"
      : result === "不正解..."
      ? "result incorrect"
      : "result";

  return (
    <Layout>
      <CenteredCardLayout>
        <OverlayLoading
          isLoading={problemLoading || answerLoading}
          size={100}
        />
        {problemError ? (
          <p>Error: {problemError}</p>
        ) : (
          <>
            {currentProblem && (
              <>
                <div className="problem-navigation">
                  {problems.map((_, idx) => (
                    <button
                      key={idx}
                      className={`nav-button ${
                        idx === currentIndex ? "active" : ""
                      }`}
                      onClick={() => handleSelectIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <Problem
                  problemName={currentProblem.problemName}
                  problemText={currentProblem.problemText}
                  constraints={currentProblem.constraints}
                  inputFormat={currentProblem.inputFormat}
                  outputFormat={currentProblem.outputFormat}
                  inputExamples={currentProblem.inputExamples}
                  outputExamples={currentProblem.outputExamples}
                  timeLimit={currentProblem.timeLimit}
                  memoryLimit={currentProblem.memoryLimit}
                />
                <AnswerForm
                  onSubmit={handleAnswerSubmit}
                  loading={answerLoading}
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
                {showResult && (
                  <section className={resultClass} id="result">
                    <h3>提出結果</h3>
                    <p>{result}</p>
                    {message && <p>{message}</p>}
                  </section>
                )}
                {currentIndex < problems.length - 1 && (
                  <button onClick={handleNext}>次の問題へ</button>
                )}
              </>
            )}
          </>
        )}
      </CenteredCardLayout>
    </Layout>
  );
};

export default ProblemPage;
