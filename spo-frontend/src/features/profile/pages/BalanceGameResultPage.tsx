import { useState } from "react";
import type { UserTasteProfileResponse } from "../../../types/profile";
import { addTasteProfile } from "../api/UserTasteProfileApi";
import { useAnswerStore } from "../config/answerStore";
import { QnA } from "../config/balanceGameQnA";
import styles from "../components/BalanceGameResultPage.module.css";

export default function BalanceGameResultPage() {
  const [result, setResult] = useState<UserTasteProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const summaryLines =
    result?.profileSummary
      ?.split(/(?<=[.!?।。！？])\s+/)
      .filter((line) => line.trim().length > 0) ?? [];
  const handleSubmit = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const payloadAnswers = useAnswerStore
        .getState()
        .answers.filter((a): a is NonNullable<typeof a> => a !== null);
      if (payloadAnswers.length !== QnA.length) {
        return;
      }
      console.log("제출할 답변들:", payloadAnswers);
      const response = await addTasteProfile({ answers: payloadAnswers });
      setResult(response);
    } catch (error) {
      console.error("Failed to submit taste profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.label}>Your Taste Profile</span>
            <h1 className={styles.title}>
              {result
                ? result.profileTypeName
                : "당신의 취향 프로필을 정리하는 중이에요"}
            </h1>
            <p className={styles.description}>
              {result
                ? result.profileOneLiner
                : "답변을 바탕으로 당신의 음악 취향 패턴과 추천곡을 구성하고 있어요."}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        {!result && !isLoading && (
          <div className={styles.panel}>
            <div className={styles.submitBox}>
              <h2 className={styles.panelTitle}>결과 만들기</h2>
              <p className={styles.panelDescription}>
                8개의 답변을 바탕으로 취향 요약과 웰컴 뮤직을 준비합니다.
              </p>
              <button
                className={styles.primaryBtn}
                type="button"
                onClick={handleSubmit}
              >
                결과 보기
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className={styles.panel}>
            <div className={styles.loadingBox}>
              <div className={styles.loadingText}>
                결과를 정리하고 있어요...
              </div>
            </div>
          </div>
        )}

        {result && !isLoading && (
          <div className={styles.resultLayout}>
            <div className={styles.summaryPanel}>
              <div className={styles.summaryHeader}>
                <span className={styles.typeBadge}>
                  {result.profileTypeName}
                </span>
                <h2 className={styles.summaryTitle}>
                  {result.profileOneLiner}
                </h2>

                <div className={styles.summaryTextGroup}>
                  {summaryLines.map((line, index) => (
                    <p key={`${line}-${index}`} className={styles.summaryText}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.trackPanel}>
              <div className={styles.sectionTop}>
                <h3 className={styles.sectionTitle}>Welcome Music</h3>
                <p className={styles.sectionDescription}>
                  지금의 취향에 자연스럽게 닿을 3곡이에요.
                </p>
              </div>

              <div className={styles.trackList}>
                {result.tracks.map((track) => (
                  <div key={track.trackId} className={styles.trackCard}>
                    <div className={styles.thumbnailWrap}>
                      <img
                        className={styles.thumbnail}
                        src={track.imageUrl}
                        alt={track.name}
                      />
                    </div>
                    <div className={styles.trackMeta}>
                      <div className={styles.trackName}>{track.name}</div>
                      <div className={styles.artistName}>{track.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
