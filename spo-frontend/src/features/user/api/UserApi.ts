import { api } from '../../../shared/api/client'

export async function getMyInfo() {
  try {
    const res = await api.get(`/users/me`)
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function updateUsername(username: string) {
  try {
    const data = { username }
    const res = await api.patch(`/users/me/username`, data)
    return res.data
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
