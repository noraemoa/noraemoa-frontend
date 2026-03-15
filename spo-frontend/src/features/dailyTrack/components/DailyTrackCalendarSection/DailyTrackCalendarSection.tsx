import { useMemo, useState } from 'react'
import type { Month } from '../../../../types/calendar'
import type { DailyTrack } from '../../../../types/dailyTrack'
import styles from './DailyTrackCalendarSection.module.css'
import {
  buildCalendarCells,
  getMonthLabel,
  getNextYearMonth,
  getPrevYearMonth,
} from '../../../../utils/date'
import { DAILY_TRACK_EMOTION_OPTIONS } from '../../constants/dailyTrackEmotion'
import { DEFAULT_THUMBNAIL } from '../../../../utils/image'

interface DailyTrackCalendarSectionProps {
  monthlyTracks: DailyTrack[]
  yearMonth: {
    year: number
    month: Month
  }
  setYearMonth: React.Dispatch<
    React.SetStateAction<{
      year: number
      month: Month
    }>
  >
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function DailyTrackCalendarSection({
  monthlyTracks,
  yearMonth,
  setYearMonth,
}: DailyTrackCalendarSectionProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const cells = useMemo(() => {
    return buildCalendarCells(yearMonth.year, yearMonth.month)
  }, [yearMonth])

  const trackMap = useMemo(() => {
    return new Map(monthlyTracks.map((track) => [track.selectedDate, track]))
  }, [monthlyTracks])

  const selectedTrack = selectedDate
    ? (trackMap.get(selectedDate) ?? null)
    : null

  const selectedTrackEmotion =
    selectedTrack && selectedTrack.emotion !== 'NONE'
      ? (DAILY_TRACK_EMOTION_OPTIONS.find(
          (e) => e.value === selectedTrack.emotion
        ) ?? null)
      : null

  const handlePrevMonth = () => {
    setYearMonth(getPrevYearMonth(yearMonth.year, yearMonth.month))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setYearMonth(getNextYearMonth(yearMonth.year, yearMonth.month))
    setSelectedDate(null)
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.detailPane}>
            <div className={styles.detailCard}>
              {selectedTrack ? (
                <>
                  <div className={styles.detailDate}>
                    {selectedTrack.selectedDate}
                  </div>

                  <div className={styles.detailThumbnailWrap}>
                    <img
                      src={selectedTrack.imageUrl || DEFAULT_THUMBNAIL}
                      alt={selectedTrack.name}
                      className={styles.detailThumbnail}
                    />
                  </div>

                  <div className={styles.detailTitle}>{selectedTrack.name}</div>
                  <div className={styles.detailArtist}>
                    {selectedTrack.artist}
                  </div>

                  {selectedTrackEmotion && (
                    <div className={styles.detailEmotion}>
                      <span>{selectedTrackEmotion.emoji}</span>
                      <span>{selectedTrackEmotion.label}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyDetailWrap}>
                  <div className={styles.emptyDetailTitle}>기록 보기</div>
                  <div className={styles.emptyDetail}>
                    날짜를 선택하면 그날 기록한 노래와 감정을 볼 수 있어요.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.calendarPane}>
            <div className={styles.calendarCard}>
              <div className={styles.header}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={handlePrevMonth}
                  aria-label="이전 달"
                >
                  ←
                </button>

                <div className={styles.headerText}>
                  <div className={styles.year}>{yearMonth.year}</div>
                  <div className={styles.month}>
                    {getMonthLabel(yearMonth.month)}
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={handleNextMonth}
                  aria-label="다음 달"
                >
                  →
                </button>
              </div>

              <div className={styles.board}>
                <div className={styles.weekdays}>
                  {WEEKDAYS.map((day, index) => (
                    <div key={`${day}-${index}`} className={styles.weekday}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className={styles.grid}>
                  {cells.map((cell, index) => {
                    const track = cell.dateKey
                      ? (trackMap.get(cell.dateKey) ?? null)
                      : null

                    const emotion =
                      track && track.emotion !== 'NONE'
                        ? (DAILY_TRACK_EMOTION_OPTIONS.find(
                            (e) => e.value === track.emotion
                          ) ?? null)
                        : null

                    const isSelected = selectedDate === cell.dateKey

                    return (
                      <button
                        key={cell.dateKey ?? `empty-${index}`}
                        type="button"
                        className={`${styles.cell} ${
                          !cell.isCurrentMonth ? styles.emptyCell : ''
                        } ${isSelected ? styles.selectedCell : ''}`}
                        disabled={!cell.dateKey}
                        onClick={() => {
                          if (!cell.dateKey) return
                          setSelectedDate(cell.dateKey)
                        }}
                        aria-label={
                          cell.dateKey
                            ? `${cell.dateKey} 기록 보기`
                            : '빈 날짜 칸'
                        }
                      >
                        {cell.dayNumber && (
                          <>
                            <span className={styles.dayNumber}>
                              {cell.dayNumber}
                            </span>
                            {emotion && (
                              <span
                                className={styles.sticker}
                                style={{
                                  backgroundColor: getEmotionColor(
                                    emotion.value
                                  ),
                                }}
                              />
                            )}
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function getEmotionColor(emotion: string) {
  switch (emotion) {
    case 'HAPPY':
      return '#F2D96B'
    case 'CALM':
      return '#53D18D'
    case 'SAD':
      return '#7FA8D1'
    case 'ENERGETIC':
      return '#F4A340'
    case 'LATE_NIGHT':
      return '#8B78B6'
    case 'FOCUSED':
      return '#B8C4C1'
    case 'ROMANTIC':
      return '#F0AAA4'
    default:
      return 'transparent'
  }
}
