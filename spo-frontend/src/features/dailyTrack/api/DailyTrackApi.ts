import type { TrackCreateRequestDto } from '../../../types/track'
import { api } from '../../../shared/api/client'
import axios from 'axios'
import type { DailyTrackEmotion } from '../../../types/dailyTrack'
import type { Month } from '../../../types/calendar'

//get
export async function getTodayTrack() {
  try {
    const res = await api.get(`/daily-tracks/today`)
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    console.log(error)
    throw error
  }
}

export async function getMyDailyTracks() {
  try {
    const res = await api.get(`/users/me/daily-tracks`)
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getCurrentStreak() {
  try {
    const res = await api.get(`/users/me/daily-tracks/streak`)
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getMonthlyTracks(year: number, month: Month) {
  try {
    const res = await api.get(`/users/me/daily-tracks/calendar`, {
      params: { year, month },
    })
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getYesterdayDailyTracks() {
  try {
    const res = await api.get(`/daily-tracks/yesterday`)
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

//put
export async function saveTodayTrack(dto: TrackCreateRequestDto) {
  try {
    const res = await api.put(`/daily-tracks/today`, dto)
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function saveTodayEmotion(emotion: DailyTrackEmotion) {
  try {
    const res = await api.put(`/daily-tracks/today/emotion`, null, {
      params: { emotion },
    })
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
