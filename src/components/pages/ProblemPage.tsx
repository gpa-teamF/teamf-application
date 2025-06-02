import React, { useEffect, useState } from "react";
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
    setOnModalOk(() => () => {
      setIsModalOpen(false);
      doSubmit();
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
        setModalContent("提出中にエラーが発生しました。もう一度お試し下さい。");
        setOnModalOk(() => () => {
          setIsModalOpen(false);
          doSubmit();
        });
        setIsModalOpen(true);
      }
    } catch (e) {
      console.error("提出エラー:", e);
      alert("提出中にエラーが発生しました。もう一度お試しください。");
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
        return "リザルト画面へ進む";
      default:
        return "確認";
    }
  };

  const getModalShowCancelButton = () => {
    switch (modalMode) {
      case "canNotSubmit":
        return false;
      case "submitConfirm":
      case "submitError":
      case "notAllSubmitted":
      case "gotoResultConfirm":
      default:
        return true;
    }
  };

  const navigateToResult = () => {
    const hasUnsubmitted = problems.some((_, index) => !isSubmittedMap[index]);

    if (hasUnsubmitted) {
      setModalMode("notAllSubmitted");
      setModalContent(
        "未提出の問題があります。本当に最終リザルトへ進みますか？問題ページには戻れません。"
      );
      setOnModalOk(() => () => {
        setIsModalOpen(false);
        navigate("/result", {
          state: { submissionResults },
        });
      });
      setIsModalOpen(true);
    } else {
      setModalMode("gotoResultConfirm");
      setModalContent(
        "本当に最終リザルトへ進みますか？ 問題ページには戻れません。"
      );
      setOnModalOk(() => () => {
        setIsModalOpen(false);
        navigate("/result", {
          state: { submissionResults: submissionResults },
        });
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
          isLoading={problemLoading || executionLoading}
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

              <ProblemCard problemData={currentProblem} />

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
