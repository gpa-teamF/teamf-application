import React, { useState, useEffect } from "react";
import Problem from "../features/problem/ProblemCard";
import CodeExecutionCard, {
  ProblemState,
} from "../features/problem/CodeExecutionCard";
import SubmissionResult from "../features/problem/SubmissionResult";
import Layout from "../layout/Layout";
import useApi from "../../hooks/useApi";
import {
  getMultipleProblemResponse,
  getProblemResponseBody,
} from "../../models/getProblemResponse";
import OverlayLoading from "../common/OverlayLoading";
import { useLocation } from "react-router-dom";
import CenteredCardLayout from "../layout/CenteredCardLayout";
import "./ProblemPage.css";
import { ExecuteCodeResponse } from "../../models/executeCodeResponse";
import {
  testResults,
  evaluateResult,
  evaluateCodeResponse,
} from "../../models/evaluateCodeResponse";

const ProblemPage: React.FC = () => {
  const location = useLocation();
  const { level } = location.state || {};
  const [problems, setProblems] = useState<getProblemResponseBody[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [problemStates, setProblemStates] = useState<ProblemState[]>([]);
  const [isSubmittedMap, setIsSubmittedMap] = useState<Record<number, boolean>>(
    {}
  );
  const [isSubmittingMap, setIsSubmittingMap] = useState<
    Record<number, boolean>
  >({});
  const [submissionTestResults, setSubmissionTestResults] = useState<
    Record<number, testResults | null>
  >({});
  const [submissionEvaluateResults, setSubmissionEvaluateResults] = useState<
    Record<number, evaluateResult | null>
  >({});

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

  // const {
  //   data: submissionResult,
  //   error: submissionError,
  //   loading: submissionLoading,
  //   fetchData: fetchSubmission,
  // } = useApi<evaluateCodeResponse>();

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
      const initialStates = problemData.map(() => ({
        code: "",
        stdin: "",
        language: "python",
        executionResult: undefined,
      }));
      setProblemStates(initialStates);
      const initialTestResults: Record<number, testResults | null> = {};
      const initialEvalResults: Record<number, evaluateResult | null> = {};
      const initialSubmitting: Record<number, boolean> = {};
      const initialSubmitted: Record<number, boolean> = {};
      problemData.forEach((_, idx) => {
        initialTestResults[idx] = null;
        initialEvalResults[idx] = null;
        initialSubmitting[idx] = false;
        initialSubmitted[idx] = false;
      });
      setSubmissionTestResults(initialTestResults);
      setSubmissionEvaluateResults(initialEvalResults);
      setIsSubmittingMap(initialSubmitting);
      setIsSubmittedMap(initialSubmitted);
    }
  }, [problemData]);

  useEffect(() => {
    if (executionResult !== null && executionResult !== undefined) {
      setProblemStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[currentIndex] = {
          ...newStates[currentIndex],
          executionResult,
        };
        return newStates;
      });
    }
  }, [executionResult, currentIndex]);

  const handleCodeExecute = async (
    code: string,
    stdin: string,
    problemIndex: number
  ) => {
    if (isSubmittedMap[problemIndex]) return;
    await fetchExecution("/execute", "post", {
      data: { code, stdin, language: problemStates[problemIndex].language },
    });
  };

  const handleSelectIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const handleLanguageChange = (lang: string, problemIndex: number) => {
    const newStates = [...problemStates];
    newStates[problemIndex] = {
      ...newStates[problemIndex],
      language: lang,
    };
    setProblemStates(newStates);
  };

  const handleSubmit = async () => {
    // API呼び出しの代替：ダミーデータ
    const simulatedTestResults: testResults = Array.from(
      { length: 5 },
      (_, idx) => ({
        testcaseId: idx + 1,
        status: ["AC", "WA", "TLE", "MLE", "CE"][
          Math.floor(Math.random() * 5)
        ] as "AC" | "WA" | "TLE" | "MLE" | "CE",
        executionTime: Math.floor(Math.random() * 20 + 5),
        memoryUsage: Math.floor(Math.random() * 500 + 800),
      })
    );

    const simulatedEvalResult: evaluateResult = {
      totalScore: 85,
      correctnessScore: 90,
      performanceScore: 80,
      algorithmsScore: 75,
      codeQualityScore: 88,
      readabilityScore: 92,
    };

    setIsSubmittingMap((prev) => ({ ...prev, [currentIndex]: true }));

    await new Promise((res) => setTimeout(res, 1000));

    setSubmissionTestResults((prev) => ({
      ...prev,
      [currentIndex]: simulatedTestResults,
    }));
    setSubmissionEvaluateResults((prev) => ({
      ...prev,
      [currentIndex]: simulatedEvalResult,
    }));
    setIsSubmittedMap((prev) => ({ ...prev, [currentIndex]: true }));
    setIsSubmittingMap((prev) => ({ ...prev, [currentIndex]: false }));

    // // 実際にAPIを呼び出す
    // const currentProblemId = problems[currentIndex]?.problemId;
    // const currentState = problemStates[currentIndex];
    // if (!currentProblemId || !currentState || isSubmittedMap[currentIndex])
    //   return;

    // setIsSubmittingMap((prev) => ({ ...prev, [currentIndex]: true }));

    // await fetchSubmission("/submit", "post", {
    //   data: {
    //     code: currentState.code,
    //     stdin: currentState.stdin,
    //     language: currentState.language,
    //     problemId: currentProblemId,
    //   },
    // });

    // if (submissionResult) {
    //   setSubmissionTestResults((prev) => ({
    //     ...prev,
    //     [currentIndex]: submissionResult.testResults,
    //   }));
    //   setSubmissionEvaluateResults((prev) => ({
    //     ...prev,
    //     [currentIndex]: submissionResult.evaluateResult,
    //   }));
    //   setIsSubmittedMap((prev) => ({ ...prev, [currentIndex]: true }));
    // } else if (submissionError) {
    //   console.error("提出失敗:", submissionError);
    // }

    // setIsSubmittingMap((prev) => ({ ...prev, [currentIndex]: false }));
  };

  const currentProblem = problems[currentIndex];
  const currentTestResults = submissionTestResults[currentIndex] || [];
  const currentEvaluateResult = submissionEvaluateResults[currentIndex] || null;
  const isCurrentSubmitting = isSubmittingMap[currentIndex] || false;
  const isCurrentSubmitted = isSubmittedMap[currentIndex] || false;

  return (
    <Layout>
      <CenteredCardLayout>
        <OverlayLoading
          isLoading={problemLoading || executionLoading}
          size={100}
        />
        {problemError ? (
          <p>Error: {problemError}</p>
        ) : (
          <div>
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

                <CodeExecutionCard
                  problemIndex={currentIndex}
                  onExecute={handleCodeExecute}
                  loading={executionLoading}
                  isSubmitting={isCurrentSubmitting}
                  onLanguageChange={handleLanguageChange}
                  problemStates={problemStates}
                  setProblemStates={setProblemStates}
                  disabled={isCurrentSubmitted}
                />

                <SubmissionResult
                  isSubmitting={isCurrentSubmitting}
                  testResults={currentTestResults}
                  evaluateResult={currentEvaluateResult}
                  onSubmit={handleSubmit}
                  isSubmitted={isCurrentSubmitted}
                />
              </>
            )}
          </div>
        )}
      </CenteredCardLayout>
    </Layout>
  );
};

export default ProblemPage;
