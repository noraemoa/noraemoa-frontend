import type { YesterdayDailyTrack } from '../../../../types/dailyTrack'
import { DEFAULT_THUMBNAIL } from '../../../../utils/image'
import { DAILY_TRACK_EMOTION_OPTIONS } from '../../../dailyTrack/constants/dailyTrackEmotion'
import styles from './DailyTrackResSection.module.css'

interface DailyTrackResSectionProps {
  items: YesterdayDailyTrack[]
  featured?: boolean
}

export default function DailyTrackResSectionCard({
  items,
  featured,
}: DailyTrackResSectionProps) {
  return (
    <>
      {items.map((item) => {
        const selectedEmotion =
          DAILY_TRACK_EMOTION_OPTIONS.find((e) => e.value === item.emotion) ??
          null

        return (
          <div
            key={item.id}
            className={`${styles.card} ${featured ? styles.featuredCard : ''}`}
          >
            <div className={styles.thumbnailWrap}>
              <img
                src={item.imageUrl ? item.imageUrl : DEFAULT_THUMBNAIL}
                alt={item.name}
                className={styles.thumbnail}
              />
            </div>

            <div className={styles.name}>{item.name}</div>
            <div className={styles.artist}>{item.artist}</div>
            <div className={styles.username}>@{item.username}</div>

            {selectedEmotion && (
              <div className={styles.emotionBadge}>
                <span className={styles.emotionEmoji}>
                  {selectedEmotion.emoji}
                </span>
                <span className={styles.emotionLabel}>
                  {selectedEmotion.label}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
