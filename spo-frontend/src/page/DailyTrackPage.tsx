import styles from '../features/dailyTrack/components/DailyTrack.module.css'
import { useCallback, useEffect, useState } from 'react'
import type { DailyTrack } from '../types/dailyTrack'
import {
  getMyDailyTracks,
  getTodayTrack,
  saveTodayTrack,
} from '../features/dailyTrack/api/DailyTrackApi'
import type { TrackCreateRequestDto } from '../types/track'
import { getTodayDate } from '../utils/date'
import { useTrackSearch } from '../features/search/hooks/useTrackSearch'
import DailyTrackSearchPanel from '../features/dailyTrack/components/DailyTrackSearchPanel/DailyTrackSearchPanel'
import DailyTrackHero from '../features/dailyTrack/components/DailyTrackHero/DailyTrackHero'
import DailyTrackHistorySection from '../features/dailyTrack/components/DailyTrackHistorySection/DailyTrackHistorySection'

export default function DailyTrackPage() {
  const [currentDate, setCurrentDate] = useState(getTodayDate())
  const [todayTrack, setTodayTrack] = useState<DailyTrack | null>(null)
  const [myDailyTracks, setMyDailyTracks] = useState<DailyTrack[]>([])

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

  const fetchTracks = useCallback(async () => {
    try {
      const [todayTrackData, myDailyTracksData] = await Promise.all([
        getTodayTrack(),
        getMyDailyTracks(),
      ])
      console.log('ㅇㄴ: ', myDailyTracksData)
      setTodayTrack(todayTrackData)
      setMyDailyTracks(myDailyTracksData)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleSaveTodayTrack = async (dto: TrackCreateRequestDto) => {
    try {
      await saveTodayTrack(dto)
      await fetchTracks()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [fetchTracks, currentDate])

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
      />

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

      <DailyTrackHistorySection tracks={myDailyTracks} />
    </div>
  )
}
