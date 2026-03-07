import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { searchTrack } from '../features/search/api/TrackApi'
import type { Artist, Search } from '../types/search'
import styles from '../features/search/components/SearchPage.module.css'
import { getArtist } from '../features/search/api/ArtistApi'
import {
  addTrackToPlaylist,
  getMyPlaylists,
} from '../features/playlists/api/PlaylistApi'
import type { TrackCreateRequestDto } from '../types/track'
import MenuModal from '../shared/modals/MenuModal'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { Playlist } from '../types/playlist'

export default function SearchPage() {
  const { id } = useParams()
  const [tracks, setTracks] = useState<Search | null>(null)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const navigate = useNavigate()

  const handleAddTrack = async (
    playlistId: number,
    dto: TrackCreateRequestDto
  ) => {
    try {
      console.log('click: ', dto)
      await addTrackToPlaylist(playlistId, dto)

      navigate(`/detail/playlist/${playlistId}`)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFetchPlaylists = async () => {
    console.log('handleFetchPlaylists start')
    try {
      const playlistsRes = await getMyPlaylists()
      console.log('playlistsRes.data', playlistsRes.data)
      setPlaylists(playlistsRes.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const fetchTracks = async () => {
      const tracksRes = await searchTrack(id ?? '')
      setTracks(tracksRes.data)
    }

    fetchTracks()
  }, [id])

  useEffect(() => {
    if (tracks?.items.length === 0) return
    const fetchArtist = async () => {
      const artistId = tracks?.items.at(0)?.artists.at(0)?.artistId
      if (!artistId) return
      const artistRes = await getArtist(artistId)
      setArtist(artistRes.data)
    }
    fetchArtist()
  }, [tracks])

  useEffect(() => {
    handleFetchPlaylists()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.topSection}>
        <div className={styles.artistBlock}>
          <h2 className={styles.sectionTitle}>아티스트</h2>

          <div className={styles.artistCard}>
            <img
              src={artist?.images?.at(0)?.url}
              alt={artist?.name ?? 'artist'}
              className={styles.artistImage}
            />
            <div className={styles.artistName}>{artist?.name}</div>
          </div>
        </div>

        <div className={styles.trackBlock}>
          <h2 className={styles.sectionTitle}>곡</h2>
          <div className={styles.trackList}>
            {tracks?.items.map((i) => (
              <div key={i.trackId} className={styles.trackRow}>
                <div className={styles.trackLeft}>
                  <img
                    src={i.album?.albumImages?.at(0)?.url}
                    alt={i.name}
                    className={styles.trackThumb}
                  />

                  <div className={styles.trackMeta}>
                    <div className={styles.trackName}>{i.name}</div>
                    <div className={styles.trackArtist}>
                      {i.artists.at(0)?.name}
                    </div>
                  </div>
                </div>

                <MenuModal triggerName="+">
                  <DropdownMenu.Content
                    side="bottom"
                    align="end"
                    sideOffset={19}
                    collisionPadding={3}
                    sticky="always"
                  >
                    {playlists.map((p) => (
                      <>
                        <DropdownMenu.Item asChild>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() =>
                              handleAddTrack(p.id, {
                                spotifyId: i.trackId,
                                name: i.name,
                                artist: i.artists.at(0)?.name,
                                album: i.album.albumId,
                                imageUrl: i.album.albumImages.at(0)?.url,
                                durationMs: i.durationMs,
                              })
                            }
                          >
                            {p.title}
                          </button>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator
                          className={styles.dropdownSeparator}
                        />
                      </>
                    ))}
                    <DropdownMenu.Item asChild>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={() => console.log('테스트 버튼')}
                      >
                        테스트
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </MenuModal>

                <div className={styles.trackDuration}>
                  {Math.floor(i.durationMs / 60000)}:
                  {Math.floor((i.durationMs % 60000) / 1000)
                    .toString()
                    .padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <h2 className={styles.sectionTitle}>{artist?.name} 피처링</h2>

        <div className={styles.cardRow}>
          {tracks?.items.map((i) => (
            <div key={i.trackId} className={styles.playlistCard}>
              <img
                src={i.album?.albumImages?.at(0)?.url}
                alt={i.name}
                className={styles.playlistImage}
              />
              <div className={styles.playlistTitle}>{i.name}</div>
              <div className={styles.playlistDesc}>
                {i.artists?.at(0)?.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
