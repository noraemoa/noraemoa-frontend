import { api } from '../../../shared/api/client'

export async function getArtist(id: string) {
  try {
    const res = await api.get(`/tracks/artist/${id}`)
    return res
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
