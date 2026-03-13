import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { searchTrack } from '../features/track/api/TrackApi'
import type { Artist } from '../types/search'
import styles from '../features/search/components/SearchPage.module.css'
import { getArtist } from '../features/search/api/ArtistApi'
import {
  addTrackToPlaylist,
  getMyPlaylists,
} from '../features/playlists/api/PlaylistApi'
import type { Track, TrackCreateRequestDto } from '../types/track'
import MenuModal from '../shared/modals/MenuModal'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { Playlist } from '../types/playlist'
import SearchItems from '../features/search/components/SearchItems'

export default function SearchPage() {
  const { id } = useParams()
  const [tracks, setTracks] = useState<Track | null>(null)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const navigate = useNavigate()

  const keyword = id ?? ''

  const handleAddTrack = async (
    playlistId: number,
    dto: TrackCreateRequestDto
  ) => {
    try {
      await addTrackToPlaylist(playlistId, dto)
      navigate(`/detail/playlist/${playlistId}`)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFetchPlaylists = async () => {
    try {
      const playlistsRes = await getMyPlaylists()
      setPlaylists(playlistsRes.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const tracksRes = await searchTrack(keyword)
        setTracks(tracksRes.data)
      } catch (e) {
        console.error(e)
        setTracks(null)
      }
    }

    fetchTracks()
  }, [keyword])

  useEffect(() => {
    if (!tracks?.tracks?.length) return

    const fetchArtist = async () => {
      try {
        const artistId = tracks.tracks.at(0)?.artist?.artistId
        if (!artistId) return
        const artistRes = await getArtist(artistId)
        setArtist(artistRes.data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchArtist()
  }, [tracks])

  useEffect(() => {
    handleFetchPlaylists()
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.label}>Search</div>
          <h1 className={styles.heroTitle}>“{keyword}” 검색 결과</h1>
          <p className={styles.heroDescription}>
            찾고 있는 곡을 둘러보고, 좋아요를 남기거나 플레이리스트에
            추가해보세요.
          </p>
        </div>
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <div className={styles.resultsHeaderText}>
            <h2 className={styles.resultsTitle}>검색 결과</h2>
            <p className={styles.resultsDescription}>
              가장 관련도 높은 아티스트와 곡을 정리해서 보여드려요.
            </p>
          </div>
        </div>

        <div className={styles.topSection}>
          <div className={styles.artistBlock}>
            <div className={styles.blockHeader}>
              <h3 className={styles.blockTitle}>아티스트</h3>
            </div>

            <div className={styles.artistCard}>
              <div className={styles.artistLabel}>대표 아티스트</div>
              <img
                src={artist?.images?.at(0)?.url}
                alt={artist?.name ?? 'artist'}
                className={styles.artistImage}
              />
              <div className={styles.artistName}>{artist?.name ?? keyword}</div>
            </div>
          </div>

          <div className={styles.trackBlock}>
            <div className={styles.blockHeader}>
              <h3 className={styles.blockTitle}>곡</h3>
            </div>

            <div className={styles.trackPanel}>
              <SearchItems onLikeBtn={true} tracks={tracks}>
                {(track) => (
                  <MenuModal
                    triggerName="+"
                    className={styles.addBtn}
                    key={track.trackId}
                  >
                    <DropdownMenu.Content
                      className={styles.dropdownContent}
                      side="bottom"
                      align="end"
                      sideOffset={19}
                      collisionPadding={3}
                      sticky="always"
                    >
                      {playlists.map((p) => (
                        <DropdownMenu.Item asChild key={p.id}>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() =>
                              handleAddTrack(p.id, {
                                spotifyId: track.spotifyId,
                                name: track.name,
                                artist: track.artistName,
                                album: track.album,
                                imageUrl: track.imageUrl,
                                durationMs: track.durationMs,
                              })
                            }
                          >
                            {p.title}
                          </button>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </MenuModal>
                )}
              </SearchItems>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
