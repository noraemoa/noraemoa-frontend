import type { TrackCreateRequestDto } from '../../../types/track'
import { api } from '../../../shared/api/client'
import axios from 'axios'

export async function saveTodayTrack(dto: TrackCreateRequestDto) {
  try {
    const res = await api.put(`/daily-tracks/today`, dto)
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

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
