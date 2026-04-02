import { useAnswerStore } from "../features/profile/config/answerStore";
import {
  QnA,
  type BalanceGameConfig,
} from "../features/profile/config/balanceGameQnA";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import styles from "../features/profile/components/BalanceGamePage.module.css";

export default function BalanceGamePage() {
  const { id } = useParams();
  const pageId = Number(id);
  const navigate = useNavigate();

  const answers = useAnswerStore((state) => state.answers);
  const setAnswer = useAnswerStore((state) => state.setAnswer);

  const questionIndex = pageId - 1;
  const balanceQuestion: BalanceGameConfig | null =
    Number.isInteger(pageId) && pageId > 0 && pageId <= QnA.length
      ? QnA[questionIndex]
      : null;

  useEffect(() => {
    if (!Number.isInteger(pageId) || pageId <= 0 || pageId > QnA.length) {
      navigate("/");
    }
  }, [pageId, navigate]);

  if (balanceQuestion == null) {
    return null;
  }
  const currentAnswer = answers[questionIndex];
  const isLastPage = pageId === QnA.length;
  const isCurrentAnswered = currentAnswer !== null;
  const progressPercent = Math.round((pageId / QnA.length) * 100);

  const handleBack = () => {
    if (pageId > 1) {
      navigate(`/me/taste-profile/${pageId - 1}`);
      return;
    }
    navigate("/me/taste-profile/1");
  };
  const handleNext = () => {
    if (!currentAnswer) return;

    if (isLastPage) {
      navigate("/me/taste-profile/result");
      return;
    }

    navigate(`/me/taste-profile/${pageId + 1}`);
  };
  const handleSelect = (choiceText: string, choiceKey: string) => {
    setAnswer(questionIndex, {
      questionText: balanceQuestion.question,
      choiceText,
      choiceKey,
    });
    if (!isLastPage) {
      navigate(`/me/taste-profile/${pageId == 8 ? pageId : pageId + 1}`);
    }
    console.log("답변 저장:", isCurrentAnswered, answers);
    if (isLastPage && isCurrentAnswered) {
      console.log("마지막 페이지 답변 완료, 결과 페이지로 이동");
      navigate(`/me/taste-profile/result`);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.label}>Taste Profile</span>
            <h1 className={styles.title}>
              몇 가지 선택으로 음악 취향의 결을 정리해볼게요
            </h1>
            <p className={styles.description}>
              정답은 없어요. 더 끌리는 쪽을 고르면 됩니다.
            </p>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressTop}>
              <span className={styles.progressLabel}>진행도</span>
              <span className={styles.progressValue}>
                {pageId} / {QnA.length}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.panel}>
          <div className={styles.questionMetaRow}>
            <span className={styles.questionBadge}>Question {pageId}</span>
          </div>

          <h2 className={styles.questionTitle}>{balanceQuestion.question}</h2>

          <div className={styles.choiceGrid}>
            <button
              type="button"
              className={`${styles.choiceCard} ${
                currentAnswer?.choiceKey === balanceQuestion.choice_1.choiceKey
                  ? styles.choiceCardActive
                  : ""
              }`}
              onClick={() =>
                handleSelect(
                  balanceQuestion.choice_1.choiceText,
                  balanceQuestion.choice_1.choiceKey,
                )
              }
            >
              <span className={styles.choiceText}>
                {balanceQuestion.choice_1.choiceText}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.choiceCard} ${
                currentAnswer?.choiceKey === balanceQuestion.choice_2.choiceKey
                  ? styles.choiceCardActive
                  : ""
              }`}
              onClick={() =>
                handleSelect(
                  balanceQuestion.choice_2.choiceText,
                  balanceQuestion.choice_2.choiceKey,
                )
              }
            >
              <span className={styles.choiceText}>
                {balanceQuestion.choice_2.choiceText}
              </span>
            </button>
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleBack}
            >
              이전
            </button>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleNext}
              disabled={!currentAnswer}
            >
              {isLastPage ? "결과 보러 가기" : "다음"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
