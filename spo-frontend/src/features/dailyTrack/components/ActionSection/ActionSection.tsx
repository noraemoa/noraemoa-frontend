import type { DailyTrackEmotion } from '../../../../types/dailyTrack'
import type { TrackCreateRequestDto } from '../../../../types/track'
import { useTrackSearch } from '../../../search/hooks/useTrackSearch'
import { DAILY_TRACK_EMOTION_OPTIONS } from '../../constants/dailyTrackEmotion'
import DailyTrackSearchPanel from '../DailyTrackSearchPanel/DailyTrackSearchPanel'
import styles from './ActionSection.module.css'

interface ActionSectionProps {
  selectedEmotionValue: DailyTrackEmotion | null
  handlePickEmotion: (emotionValue: DailyTrackEmotion) => Promise<void>
  handleSaveTodayTrack: (dto: TrackCreateRequestDto) => Promise<void>
}
export default function ActionSection({
  selectedEmotionValue,
  handlePickEmotion,
  handleSaveTodayTrack,
}: ActionSectionProps) {
  const {
    searchTracks,
    searchModalOpen,
    search,
    isSubmitted,
    setSearch,
    handleSubmit,
    handleCloseSearch,
    setSearchModalOpen,
  } = useTrackSearch()
  return (
    <section className={styles.actionSection}>
      <div className={styles.actionInner}>
        <div className={styles.emotionSection}>
          <div className={styles.emotionHeader}>
            <h2 className={styles.emotionTitle}>오늘의 무드</h2>
            <p className={styles.emotionDescription}>
              오늘의 분위기에 가장 가까운 감정을 골라보세요.
            </p>
          </div>

          <div className={styles.emotionList}>
            {DAILY_TRACK_EMOTION_OPTIONS.map((e) => {
              const isSelected = selectedEmotionValue === e.value

              return (
                <button
                  key={e.value}
                  type="button"
                  className={`${styles.emotionChip} ${
                    isSelected ? styles.emotionChipActive : ''
                  }`}
                  onClick={() => handlePickEmotion(e.value)}
                >
                  <span className={styles.emotionChipEmoji}>{e.emoji}</span>
                  <span className={styles.emotionChipLabel}>{e.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <DailyTrackSearchPanel
          searchTracks={searchTracks}
          searchModalOpen={searchModalOpen}
          search={search}
          isSubmitted={isSubmitted}
          setSearch={setSearch}
          handleSubmit={handleSubmit}
          handleCloseSearch={handleCloseSearch}
          setSearchModalOpen={setSearchModalOpen}
          handleSaveTodayTrack={handleSaveTodayTrack}
        />
      </div>
    </section>
  )
}
