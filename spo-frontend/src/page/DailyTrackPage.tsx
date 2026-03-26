import styles from '../features/dailyTrack/components/DailyTrack.module.css'
import { useCallback, useEffect, useState } from 'react'
import {
  type DailyTrackEmotionOption,
  type DailyTrack,
  type DailyTrackEmotion,
  type DailyTrackStreak,
} from '../types/dailyTrack'
import {
  getCurrentStreak,
  getMonthlyTracks,
  getMyDailyTracks,
  getTodayTrack,
  saveTodayEmotion,
  saveTodayTrack,
} from '../features/dailyTrack/api/DailyTrackApi'
import type { TrackCreateRequestDto } from '../types/track'
import { getTodayDate, getYearMonth } from '../utils/date'
import DailyTrackHero from '../features/dailyTrack/components/DailyTrackHero/DailyTrackHero'
import DailyTrackHistorySection from '../features/dailyTrack/components/DailyTrackHistorySection/DailyTrackHistorySection'
import ActionSection from '../features/dailyTrack/components/ActionSection/ActionSection'
import { DAILY_TRACK_EMOTION_OPTIONS } from '../features/dailyTrack/constants/dailyTrackEmotion'
import DailyTrackCalendarSection from '../features/dailyTrack/components/DailyTrackCalendarSection/DailyTrackCalendarSection'
import axios from 'axios'
import Toast from '../shared/components/Toast/Toast'

export default function DailyTrackPage() {
  const [currentDate, setCurrentDate] = useState(getTodayDate())
  const [todayTrack, setTodayTrack] = useState<DailyTrack | null>(null)
  const [myDailyTracks, setMyDailyTracks] = useState<DailyTrack[]>([])
  const [selectedEmotion, setSelectedEmotion] =
    useState<DailyTrackEmotionOption | null>(null)
  const [yearMonth, setYearMonth] = useState(getYearMonth())
  const [myMonthlyTracks, setMyMonthlyTracks] = useState<DailyTrack[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [todayUpdated, setTodayUpdated] = useState(false)

  const fetchTracks = useCallback(async () => {
    try {
      const [todayTrackData, myDailyTracksData] = await Promise.all([
        getTodayTrack(),
        getMyDailyTracks(),
      ])
      setTodayTrack(todayTrackData ?? null)
      if (todayTrackData && todayTrackData.emotion !== 'NONE') {
        setSelectedEmotion(
          DAILY_TRACK_EMOTION_OPTIONS.find(
            (e) => e.value === todayTrackData.emotion
          ) ?? null
        )
      } else {
        setSelectedEmotion(null)
      }
      setMyDailyTracks(myDailyTracksData.slice(0, 7) ?? null)
    } catch (e) {
      console.error(e)
      setTodayTrack(null)
      setSelectedEmotion(null)
    }
  }, [])

  const fetchMonthly = useCallback(async () => {
    try {
      const myMonthlyTracksData = await getMonthlyTracks(
        yearMonth.year,
        yearMonth.month
      )
      setMyMonthlyTracks(myMonthlyTracksData)
    } catch (e) {
      console.error(e)
      setMyMonthlyTracks([])
    }
  }, [yearMonth])

  const handleSaveTodayTrack = async (dto: TrackCreateRequestDto) => {
    try {
      const streak: DailyTrackStreak = await getCurrentStreak()
      if (!todayUpdated && streak.currentStreak >= 2)
        setToastMessage(`${streak.currentStreak}일 연속 기록했어요.`)

      await saveTodayTrack(dto)
      setTodayUpdated(true)
      await fetchTracks()
      await fetchMonthly()
    } catch (err) {
      console.error(err)
    }
  }

  const handlePickEmotion = async (emotionValue: DailyTrackEmotion) => {
    try {
      await saveTodayEmotion(emotionValue)
      setSelectedEmotion(
        DAILY_TRACK_EMOTION_OPTIONS.find((e) => e.value === emotionValue) ??
          null
      )
      await fetchMonthly()
      await fetchTracks()
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        setToastMessage('노래를 먼저 추가해주세요.')

        setTimeout(() => {
          setToastMessage(null)
        }, 2500)

        return
      }
      console.error(e)
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [fetchTracks, currentDate])

  useEffect(() => {
    fetchMonthly()
  }, [fetchMonthly])

  useEffect(() => {
    const checkDateChange = () => {
      const nextDate = getTodayDate()
      setCurrentDate((prev) => (prev !== nextDate ? nextDate : prev))
    }

    const handleFocus = () => {
      checkDateChange()
    }

    window.addEventListener('focus', handleFocus)

    const now = new Date()
    const nextMidnight = new Date()
    nextMidnight.setHours(24, 0, 0, 0)

    const timeout = window.setTimeout(() => {
      checkDateChange()

      const interval = window.setInterval(checkDateChange, 60 * 1000)

      ;(
        window as Window & { __dailyTrackDateInterval?: number }
      ).__dailyTrackDateInterval = interval
    }, nextMidnight.getTime() - now.getTime())

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.clearTimeout(timeout)

      const savedInterval = (
        window as Window & { __dailyTrackDateInterval?: number }
      ).__dailyTrackDateInterval

      if (savedInterval) {
        window.clearInterval(savedInterval)
      }
    }
  }, [])

  return (
    <div className={styles.page}>
      <DailyTrackHero
        today={currentDate}
        todayTrackImageUrl={todayTrack?.imageUrl}
        todayTrackName={todayTrack?.name}
        todayTrackArtistName={todayTrack?.artist}
        todayEmotion={selectedEmotion}
      />
      <ActionSection
        selectedEmotionValue={selectedEmotion?.value ?? null}
        handlePickEmotion={handlePickEmotion}
        handleSaveTodayTrack={handleSaveTodayTrack}
      />
      <DailyTrackHistorySection tracks={myDailyTracks} />
      <DailyTrackCalendarSection
        monthlyTracks={myMonthlyTracks}
        yearMonth={yearMonth}
        setYearMonth={setYearMonth}
      />

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  )
}
