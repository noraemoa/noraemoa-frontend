export type Visibility = 'PRIVATE' | 'PUBLIC'

export interface Playlist {
  id: number
  userId: number
  username: string
  code?: string
  title: string
  thumbnailUrl?: string | null
  visibility: Visibility
}
