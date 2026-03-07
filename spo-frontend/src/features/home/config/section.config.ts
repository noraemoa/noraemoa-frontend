import type { Playlist } from '../../../types/playlist'
import type { SectionItem } from '../../../types/section'
import {
  getMyPlaylists,
  getPublicPlaylists,
} from '../../playlists/api/PlaylistApi'

export type SectionConfig = {
  id: number
  title: string
  fetch: () => Promise<SectionItem[]>
}

export const sections: SectionConfig[] = [
  {
    id: 1,
    title: '인기 플레이리스트',
    fetch: async (): Promise<SectionItem[]> => {
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
    id: 2,
    title: '내 플레이리스트',
    fetch: async (): Promise<SectionItem[]> => {
      const res = await getMyPlaylists()
      return res.data.map((p: Playlist) => ({
        id: p.id,
        title: p.title,
        creator: p.username,
        thumbnailUrl: p.thumbnailUrl ?? null,
      }))
    },
  },
  {
    id: 3,
    title: '인기 앨범 및 싱글',
    fetch: async (): Promise<SectionItem[]> => {
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
    id: 4,
    title: '인기 아티스트',
    fetch: async (): Promise<SectionItem[]> => {
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
    id: 5,
    title: '수요일 오후는 어떠신가요',
    fetch: async (): Promise<SectionItem[]> => {
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
    id: 6,
    title: '추천 차트',
    fetch: async (): Promise<SectionItem[]> => {
      const res = await getPublicPlaylists(0, 10)
      return res.data.content.map((p: Playlist) => ({
        id: p.id,
        title: p.title,
        creator: p.username,
        thumbnailUrl: p.thumbnailUrl ?? null,
      }))
    },
  },
]
