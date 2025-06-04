import React, { useEffect, useRef, useState } from "react";
import CodeExecutionCard from "../features/problem/CodeExecutionCard";
import SubmissionCard from "../features/problem/SubmissionCard";
import Layout from "../layout/Layout";
import useApi from "../../hooks/useApi";
import OverlayLoading from "../common/OverlayLoading";
import { useLocation, useNavigate } from "react-router-dom";
import CenteredCardLayout from "../layout/CenteredCardLayout";
import "./ProblemPage.css";
import { ExecuteCodeResponse } from "../../models/executeCodeResponse";
import { ProblemState } from "../../models/problemState";
import {
  GetProblemsResponse,
  ProblemData,
} from "../../models/getProblemsResponse";
import {
  SubmitResult,
  SubmitResultResponse,
} from "../../models/submitResultResponse";
import ProblemCard from "../features/problem/ProblemCard";
import Modal from "../common/Modal";
import ProblemNavigationCard from "../features/problem/ProblemNavigationCard";

const ProblemPage: React.FC = () => {
  const location = useLocation();
  const { level } = location.state || {};
  const [problems, setProblems] = useState<ProblemData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [onModalOk, setOnModalOk] = useState<() => void>(() => {});
  const [modalMode, setModalMode] = useState<
    | "canNotSubmit"
    | "submitConfirm"
    | "submitError"
    | "notAllSubmitted"
    | "gotoResultConfirm"
    | "timeUp"
  >("canNotSubmit");
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [problemStates, setProblemStates] = useState<ProblemState[]>([]);
  const [isSubmittedMap, setIsSubmittedMap] = useState<Record<number, boolean>>(
    {}
  );
  const [isSubmittingMap, setIsSubmittingMap] = useState<
    Record<number, boolean>
  >({});
  const [submissionResults, setSubmissionResults] = useState<
    Record<number, SubmitResult | null>
  >({});

  const { loading: problemLoading, fetchData: fetchProblem } =
    useApi<GetProblemsResponse>();

  const { loading: executionLoading, fetchData: fetchExecution } =
    useApi<ExecuteCodeResponse>();

  const { loading: submitLoading, fetchData: fetchSubmission } =
    useApi<SubmitResultResponse>();

  const [submittingLoading, setSubmittingLoading] = useState(false);

  const submissionResultsRef = useRef(submissionResults);

  const isSubmittingMapRef = useRef(isSubmittingMap);

  const isNavigationToResultRef = useRef(false);

  const TIME_UP_MIN = 15;
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_UP_MIN * 60); // 秒単位でカウントダウン

  useEffect(() => {
    const loadProblems = async () => {
      if (!level) return;
      const res = await fetchProblem("/problem", "get", {
        params: { difficulty: level, count: 3 },
      });
      if (res) {
        setProblems(res);
        setProblemStates(
          res.map(() => ({
            code: "",
            stdin: "",
            language: "python",
            executionResult: undefined,
          }))
        );

        const initialMap: Record<number, boolean> = {};
        const initialResults: Record<number, SubmitResultResponse | null> = {};
        res.forEach((_, idx) => {
          initialMap[idx] = false;
          initialResults[idx] = null;
        });

        setIsSubmittingMap(initialMap);
        setIsSubmittedMap(initialMap);
        setSubmissionResults(initialResults);
      }
    };

    loadProblems();
  }, [level, fetchProblem]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isNavigationToResultRef.current) return;
      setIsTimeUp(true);
      setModalMode("timeUp");
      setModalContent("制限時間になりました。最終リザルト画面に遷移します。");
      setOnModalOk(() => async () => {
        setIsModalOpen(false);
        isNavigationToResultRef.current = true;
        await waitForAllSubmissions();
      });
      setIsModalOpen(true);
    }, TIME_UP_MIN * 60 * 1000);

    return () => clearTimeout(timer); // クリーンアップ
  }, [navigate, submissionResults]);

  useEffect(() => {
    submissionResultsRef.current = submissionResults;
  }, [submissionResults]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    isSubmittingMapRef.current = isSubmittingMap;
  }, [isSubmittingMap]);

  const updateCode = (index: number, code: string) => {
    setProblemStates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], code };
      return updated;
    });
  };

  const updateStdin = (index: number, stdin: string) => {
    setProblemStates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], stdin };
      return updated;
    });
  };

  const updateLanguage = (index: number, language: string) => {
    setProblemStates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], language };
      return updated;
    });
  };

  const handleCodeExecute = async (
    code: string,
    stdin: string,
    problemIndex: number
  ) => {
    if (isSubmittedMap[problemIndex]) return;

    const res = await fetchExecution("/execute", "post", {
      data: {
        code,
        stdin,
        language: problemStates[problemIndex].language,
        timeLimit: problems[problemIndex].timeLimit,
        memoryLimit: problems[problemIndex].memoryLimit,
      },
    });

    if (res) {
      setProblemStates((prev) => {
        const updated = [...prev];
        updated[problemIndex] = {
          ...updated[problemIndex],
          executionResult: res,
        };
        return updated;
      });
    }
  };

  const handleSubmit = () => {
    if (timeLeft <= 0) {
      setModalMode("canNotSubmit");
      setModalContent("制限時間が終了しました。提出はできません。");
      setOnModalOk(() => () => setIsModalOpen(false));
      setIsModalOpen(true);
      return;
    }

    const currentProblemId = problems[currentIndex]?.problemId;
    const currentState = problemStates[currentIndex];

    if (!currentProblemId || !currentState || isSubmittedMap[currentIndex])
      return;

    if (!currentState.code.trim()) {
      setModalMode("canNotSubmit");
      setModalContent("ソースコードが空です。コードを記述してください。");
      setOnModalOk(() => () => setIsModalOpen(false));
      setIsModalOpen(true);
      return;
    }

    // 確認ダイアログを表示
    setModalMode("submitConfirm");
    setModalContent("この問題を提出しますか？提出は一度きりです。");
    setOnModalOk(() => async () => {
      setIsModalOpen(false);
      await doSubmit();
    });
    setIsModalOpen(true);
  };

  const doSubmit = async () => {
    const currentProblemId = problems[currentIndex]?.problemId;
    const currentState = problemStates[currentIndex];

    if (!currentProblemId || !currentState) return;

    try {
      setIsSubmittingMap((prev) => ({ ...prev, [currentIndex]: true }));

      const res = await fetchSubmission("/submit", "post", {
        data: {
          code: currentState.code,
          language: currentState.language,
          problemId: currentProblemId,
        },
      });

      if (res) {
        setSubmissionResults((prev) => ({
          ...prev,
          [currentIndex]: res,
        }));
        setIsSubmittedMap((prev) => ({ ...prev, [currentIndex]: true }));
      } else {
        setModalMode("submitError");
        setModalContent(
          "提出中にエラーが発生しました。OKを押下して、もう一度お試し下さい。"
        );
        setOnModalOk(() => async () => {
          setIsModalOpen(false);
          await doSubmit();
        });
        setIsModalOpen(true);
      }
    } catch (e) {
      console.error("提出エラー:", e);
      alert(
        "提出中にエラーが発生しました。お手数をおかけしますがリザルト画面へ進み、フォームにてご連絡下さい。"
      );
    } finally {
      setIsSubmittingMap((prev) => ({ ...prev, [currentIndex]: false }));
    }
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case "canNotSubmit":
        return "提出できません";
      case "submitConfirm":
        return "提出しますか？";
      case "submitError":
        return "提出に失敗しました";
      case "notAllSubmitted":
        return "未提出の問題があります";
      case "gotoResultConfirm":
        return "最終リザルトへ進む";
      case "timeUp":
        return "時間切れ";
      default:
        return "確認";
    }
  };

  const getModalShowCancelButton = () => {
    switch (modalMode) {
      case "canNotSubmit":
      case "timeUp":
        return false;
      case "submitConfirm":
      case "submitError":
      case "notAllSubmitted":
      case "gotoResultConfirm":
      default:
        return true;
    }
  };

  const waitForAllSubmissions = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Timeout while waiting for submissions"));
      }, 30 * 1000); // 最大30秒まで待つ

      setSubmittingLoading(true);
      const checkInterval = setInterval(() => {
        const allDone = problems.every((_, index) => {
          const isNotSubmitting = !isSubmittingMapRef.current[index];
          return isNotSubmitting;
        });

        if (allDone) {
          setSubmittingLoading(false);
          clearTimeout(timeout);
          clearInterval(checkInterval);
          navigate("/result", {
            state: { submissionResults: submissionResultsRef.current },
          });
          resolve();
        }
      }, 100);
    });
  };

  const navigateToResult = () => {
    if (isNavigationToResultRef.current) return;
    const hasUnsubmitted = problems.some((_, index) => !isSubmittedMap[index]);
    if (hasUnsubmitted) {
      setModalMode("notAllSubmitted");
      setModalContent(
        "未提出の問題があります。本当に最終リザルトへ進みますか？問題ページには戻れません。"
      );
      setOnModalOk(() => async () => {
        setIsModalOpen(false);
        isNavigationToResultRef.current = true;
        await waitForAllSubmissions();
      });
      setIsModalOpen(true);
    } else {
      setModalMode("gotoResultConfirm");
      setModalContent(
        "本当に最終リザルトへ進みますか？ 問題ページには戻れません。"
      );
      setOnModalOk(() => async () => {
        setIsModalOpen(false);
        isNavigationToResultRef.current = true;
        await waitForAllSubmissions();
      });
      setIsModalOpen(true);
    }
  };

  const currentProblem = problems[currentIndex];
  const currentSubmitResult = submissionResults[currentIndex] || null;
  const isCurrentSubmitting = isSubmittingMap[currentIndex] || false;
  const isCurrentSubmitted = isSubmittedMap[currentIndex] || false;

  return (
    <Layout>
      <CenteredCardLayout>
        <OverlayLoading
          isLoading={problemLoading || executionLoading || submittingLoading}
          size={100}
        />
        <div>
          {currentProblem && (
            <>
              <ProblemNavigationCard
                currentIndex={currentIndex}
                problems={problems}
                onSelectProblem={(index) => setCurrentIndex(index)}
                onClickResult={navigateToResult}
              />

              <ProblemCard
                problemData={currentProblem}
                remainingTime={timeLeft}
                totalTime={TIME_UP_MIN * 60}
              />

              <CodeExecutionCard
                loading={executionLoading}
                isSubmitting={isCurrentSubmitting}
                isSubmitted={isCurrentSubmitted}
                currentState={problemStates[currentIndex]}
                onCodeChange={(code) => updateCode(currentIndex, code)}
                onStdinChange={(stdin) => updateStdin(currentIndex, stdin)}
                onLanguageChange={(lang) => updateLanguage(currentIndex, lang)}
                onExecute={(code, stdin) =>
                  handleCodeExecute(code, stdin, currentIndex)
                }
              />

              <SubmissionCard
                isSubmitting={isCurrentSubmitting}
                isSubmitted={isCurrentSubmitted}
                isTimeUp={isTimeUp}
                onSubmit={handleSubmit}
                submitResult={currentSubmitResult}
              />

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onOk={onModalOk}
                title={getModalTitle()}
                showCancelButton={getModalShowCancelButton()}
              >
                <p>{modalContent}</p>
              </Modal>
            </>
          )}
        </div>
      </CenteredCardLayout>
    </Layout>
  );
};

export default ProblemPage;
