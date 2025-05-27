import React, { useState, useEffect } from "react";
import Problem from "../features/problem/ProblemCard";
import AnswerForm from "../features/problem/CodeExecutionCard";
import Layout from "../layout/Layout";
import useApi from "../../hooks/useApi";
import {
  getMultipleProblemResponse,
  getProblemResponseBody,
} from "../../models/getProblemResponse";
import { judgeAnswerResponse } from "../../models/judgeAnswerResponse";
import OverlayLoading from "../common/OverlayLoading";
import { useLocation } from "react-router-dom";
import CenteredCardLayout from "../layout/CenteredCardLayout";
import "./ProblemPage.css";
import { ExecuteCodeResponse } from "../../models/executeCodeResponse";

const ProblemPage: React.FC = () => {
  const location = useLocation();
  const { level } = location.state || {};
  const [problems, setProblems] = useState<getProblemResponseBody[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("python");

  const {
    data: problemData,
    error: problemError,
    loading: problemLoading,
    fetchData: fetchProblem,
  } = useApi<getMultipleProblemResponse>();

  const {
    data: executionResult,
    error: executionError,
    loading: executionLoading,
    fetchData: fetchExecution,
  } = useApi<ExecuteCodeResponse>();

  const {
    data: answerData,
    error: answerError,
    loading: answerLoading,
    fetchData: fetchAnswer,
  } = useApi<judgeAnswerResponse>();

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
    if (problemData) {
      setProblems(problemData);
    }
  }, [problemData]);

  useEffect(() => {
    if (answerData) {
      setResult(answerData.result ? "正解!" : "不正解...");
    }
  }, [answerData]);

  const handleCodeExecute = async (code: string, stdin: string) => {
    await fetchExecution("/execute", "post", {
      data: { code, stdin, language },
    });
  };

  const handleSelectIndex = (index: number) => {
    setShowResult(false);
    setResult("");
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
          isLoading={problemLoading || executionLoading || answerLoading}
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
                  onExecute={handleCodeExecute}
                  language={language}
                  onLanguageChange={setLanguage}
                  loading={executionLoading}
                  executionResult={executionResult}
                />

                {showResult && (
                  <section className={resultClass} id="result">
                    <h3>提出結果</h3>
                    <p>{result}</p>
                  </section>
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
