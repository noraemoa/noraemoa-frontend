import type { LikedPlaylist, Playlist } from '../../../types/playlist'
import type { LikedTrackItem } from '../../../types/track'
import {
  getLikedPlaylists,
  getPublicPlaylists,
} from '../../playlists/api/PlaylistApi'
import { getLikedTracks } from '../../track/api/TrackApi'

type responseType = LikedTrackItem | Playlist | LikedPlaylist
export type ProfileSectionConfig = {
  id: number
  title: string
  description: string
  kind: string
  fetch: () => Promise<responseType[]>
}

export const profileSections: ProfileSectionConfig[] = [
  {
    id: 1,
    title: '내가 좋아하는 곡',
    description: '자주 다시 듣고 싶은 곡들을 모아봤어요.',
    kind: 'liked-track',
    fetch: async (): Promise<LikedTrackItem[]> => {
      const res = await getLikedTracks()
      return res.map((i: LikedTrackItem) => ({
        trackId: i.trackId,
        name: i.name,
        artist: i.artist,
        album: i.album,
        imageUrl: i.imageUrl,
        createdAt: i.createdAt,
      }))
    },
  },
  {
    id: 2,
    title: '나의 공개 플레이리스트',
    description: '다른 사람들과 함께 듣고 싶은 플레이리스트예요.',
    kind: 'public-playlist',
    fetch: async (): Promise<Playlist[]> => {
      const res = await getPublicPlaylists(0, 10)
      return res.data.content.map((p: Playlist) => ({
        id: p.id,
        title: p.title,
        creator: p.username,
        thumbnailUrl: p.thumbnailUrl ?? null,
      }))
    },
  },
  {
    id: 3,
    title: '내가 좋아하는 플레이리스트',
    description: '마음에 들어 저장해둔 플레이리스트예요.',
    kind: 'liked-playlist',
    fetch: async (): Promise<LikedPlaylist[]> => {
      const res = await getLikedPlaylists()
      return res.map((p: LikedPlaylist) => ({
        playlistId: p.playlistId,
        username: p.username,
        playlistTitle: p.playlistTitle,
        thumbnailUrl: p.thumbnailUrl,
        createdAt: p.createdAt,
      }))
    },
  },
]
