import type { YesterdayDailyTrack } from "../../../types/dailyTrack";
import type {
  Playlist,
  PlaylistDetails,
  PopularPlaylist,
} from "../../../types/playlist";
import type { SectionItem } from "../../../types/section";
import { getYesterdayDailyTracks } from "../../dailyTrack/api/DailyTrackApi";
import {
  getMyPlaylists,
  getPopularPlaylists,
  getPublicPlaylists,
} from "../../playlists/api/PlaylistApi";

type MyPlaylistType = {
  playlist: Playlist;
  liked: boolean;
};
type responseType =
  | SectionItem
  | YesterdayDailyTrack
  | PlaylistDetails
  | PopularPlaylist;
export type SectionConfig = {
  id: number;
  title: string;
  description: string;
  kind: string;
  fetch: () => Promise<responseType[]>;
};

export const sections: SectionConfig[] = [
  {
    id: 1,
    title: "어제 사람들은 이런 곡을 들었어요",
    description: "어제 다른 사람들의 하루를 채웠던 노래들이에요.",
    kind: "daily-track",
    fetch: async (): Promise<YesterdayDailyTrack[]> => {
      const res = await getYesterdayDailyTracks();
      return res
        .map((i: YesterdayDailyTrack) => ({
          id: i.id,
          userId: i.userId,
          username: i.username,
          trackId: i.trackId,
          spotifyId: i.spotifyId,
          name: i.name,
          artist: i.artist,
          imageUrl: i.imageUrl,
          selectedDate: i.selectedDate,
          emotion: i.emotion,
        }))
        .slice(0, 10);
    },
  },
  {
    id: 2,
    title: "인기 플레이리스트",
    description: "지금 많은 사람들이 좋아하는 플레이리스트예요.",
    kind: "auth-public-playlist",
    fetch: async (): Promise<PopularPlaylist[]> => {
      const res = await getPopularPlaylists(0, 10);
      return res
        .map((p: PopularPlaylist) => ({
          id: p.id,
          title: p.title,
          creator: p.username,
          thumbnailUrl: p.thumbnailUrl ?? null,
        }))
        .slice(0, 10);
    },
  },
  {
    id: 3,
    title: "내 플레이리스트",
    description: "내가 모아둔 플레이리스트를 다시 들어보세요.",
    kind: "playlist",
    fetch: async (): Promise<SectionItem[]> => {
      const res = await getMyPlaylists();
      const data = res.data as MyPlaylistType[];
      return data
        .map((p: MyPlaylistType) => ({
          id: p.playlist.id,
          title: p.playlist.title,
          creator: p.playlist.username,
          thumbnailUrl: p.playlist.thumbnailUrl ?? null,
        }))
        .slice(0, 10);
    },
  },
  {
    id: 4,
    title: "인기 아티스트",
    description: "요즘 많은 사람들이 듣고 있는 아티스트들이에요.",
    kind: "playlist",
    fetch: async (): Promise<PopularPlaylist[]> => {
      const res = await getPopularPlaylists(0, 10);
      return res
        .map((p: PopularPlaylist) => ({
          id: p.id,
          title: p.title,
          creator: p.username,
          thumbnailUrl: p.thumbnailUrl ?? null,
        }))
        .slice(0, 10);
    },
  },
  {
    id: 5,
    title: "수요일 오후는 어떠신가요",
    description: "수요일 오후에 어울리는 플레이리스트를 준비했어요.",
    kind: "playlist",
    fetch: async (): Promise<SectionItem[]> => {
      const res = await getPublicPlaylists(0, 10);
      return res.data.content
        .map((p: Playlist) => ({
          id: p.id,
          title: p.title,
          creator: p.username,
          thumbnailUrl: p.thumbnailUrl ?? null,
        }))
        .slice(0, 10);
    },
  },
  {
    id: 6,
    title: "추천 차트",
    description: "지금 추천하고 싶은 음악들을 소개합니다.",
    kind: "playlist",
    fetch: async (): Promise<SectionItem[]> => {
      const res = await getPublicPlaylists(0, 10);
      return res.data.content
        .map((p: Playlist) => ({
          id: p.id,
          title: p.title,
          creator: p.username,
          thumbnailUrl: p.thumbnailUrl ?? null,
        }))
        .slice(0, 10);
    },
  },
];

export const guestSections: SectionConfig[] = [
  {
    id: 1,
    title: "인기 아티스트",
    description: "요즘 많은 사람들이 듣고 있는 아티스트들이에요.",
    kind: "playlist",
    fetch: async (): Promise<SectionItem[]> => {
      const res = await getPublicPlaylists(0, 10);
      return res.data.content
        .map((p: Playlist) => ({
          id: p.id,
          title: p.title,
          creator: p.username,
          thumbnailUrl: p.thumbnailUrl ?? null,
        }))
        .slice(0, 10);
    },
  },
  {
    id: 2,
    title: "수요일 오후는 어떠신가요",
    description: "수요일 오후에 어울리는 플레이리스트를 준비했어요.",
    kind: "playlist",
    fetch: async (): Promise<SectionItem[]> => {
      const res = await getPublicPlaylists(0, 10);
      return res.data.content
        .map((p: Playlist) => ({
          id: p.id,
          title: p.title,
          creator: p.username,
          thumbnailUrl: p.thumbnailUrl ?? null,
        }))
        .slice(0, 10);
    },
  },
  {
    id: 3,
    title: "추천 차트",
    description: "지금 추천하고 싶은 음악들을 소개합니다.",
    kind: "playlist",
    fetch: async (): Promise<SectionItem[]> => {
      const res = await getPublicPlaylists(0, 10);
      return res.data.content
        .map((p: Playlist) => ({
          id: p.id,
          title: p.title,
          creator: p.username,
          thumbnailUrl: p.thumbnailUrl ?? null,
        }))
        .slice(0, 10);
    },
  },
];
