import type { DailyTrack } from '../../../../types/dailyTrack'
import styles from './DailyTrackHistorySection.module.css'
import { formatDailyTrackDate } from '../../../../utils/date'
import { DAILY_TRACK_EMOTION_OPTIONS } from '../../constants/dailyTrackEmotion'

interface DailyTrackHistorySectionProps {
  tracks: DailyTrack[]
}

export default function DailyTrackHistorySection({
  tracks,
}: DailyTrackHistorySectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>나의 기록</h2>
            <p className={styles.description}>
              하루를 대표했던 노래들을 차곡차곡 모아보세요.
            </p>
          </div>

          <div className={styles.count}>{tracks.length} tracks</div>
        </div>

        {tracks.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>아직 쌓인 기록이 없어요</div>
            <div className={styles.emptyDescription}>
              오늘의 한 곡을 남기면 이곳에 하루의 기록이 쌓여요.
            </div>
          </div>
        ) : (
          <div className={styles.list}>
            {tracks.map((track) => {
              const emotionMeta =
                track.emotion && track.emotion !== 'NONE'
                  ? (DAILY_TRACK_EMOTION_OPTIONS.find(
                      (e) => e.value === track.emotion
                    ) ?? null)
                  : null
              return (
                <div key={track.id} className={styles.item}>
                  <div className={styles.date}>
                    {formatDailyTrackDate(track.selectedDate)}
                  </div>

                  <div className={styles.thumbnailWrap}>
                    <img
                      src={track.imageUrl}
                      alt={track.name}
                      className={styles.thumbnail}
                    />
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.name}>{track.name}</div>
                    <div className={styles.artist}>{track.artist}</div>
                  </div>
                  {emotionMeta && (
                    <div className={styles.emotionBadge}>
                      <span className={styles.emotionEmoji}>
                        {emotionMeta.emoji}
                      </span>
                      <span className={styles.emotionLabel}>
                        {emotionMeta.label}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
