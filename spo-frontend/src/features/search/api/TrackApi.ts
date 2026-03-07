import { api } from '../../../shared/api/client'

export async function searchTrack(query: string) {
  try {
    const response = await api.get(`/tracks/search`, {
      params: { q: query },
    })
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
