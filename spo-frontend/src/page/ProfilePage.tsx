import { useEffect, useState } from 'react'
import type { UserResponse } from '../types/user'
import { getMyInfo, updateUsername } from '../features/user/api/UserApi'
import { type LikedTrackItem } from '../types/track'
import { getLikedTracks } from '../features/track/api/TrackApi'
import type { LikedPlaylist, Playlist } from '../types/playlist'
import {
  getLikedPlaylists,
  getPublicPlaylists,
} from '../features/playlists/api/PlaylistApi'
import { DEFAULT_THUMBNAIL } from '../utils/image'
import styles from '../features/profile/components/ProfilePage.module.css'
import type { DailyTrackStreak } from '../types/dailyTrack'
import { getCurrentStreak } from '../features/dailyTrack/api/DailyTrackApi'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const [username, setUsername] = useState('')
  const [draftUsername, setDraftUsername] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  const [likedTracks, setLikedTracks] = useState<LikedTrackItem[]>([])
  const [publicPlaylists, setPublicPlaylists] = useState<Playlist[]>([])
  const [likedPlaylists, setLikedPlaylists] = useState<LikedPlaylist[]>([])
  const [streak, setStreak] = useState(0)
  const navigate = useNavigate()

  const handlePlaylistDetail = (id: number) => {
    navigate(`/detail/playlist/${id}`)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await updateUsername(draftUsername)
    const nextUsername = res.username ?? draftUsername
    setUsername(nextUsername)
    setDraftUsername(nextUsername)
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setDraftUsername(username)
    setIsEditingName(false)
  }

  const handleSection = (id: number) => {
    navigate(`/me/${id}`)
  }

  useEffect(() => {
    const fetchMyInfo = async () => {
      const resData: UserResponse = await getMyInfo()
      setUsername(resData.username)
      setDraftUsername(resData.username)
    }

    const fetchTrackAndPlaylist = async () => {
      const [tracksRes, publicPlaylistsRes, likedPlaylistsRes, streakRes] =
        await Promise.all([
          getLikedTracks(),
          getPublicPlaylists(0, 10),
          getLikedPlaylists(),
          getCurrentStreak(),
        ])

      const publicPlaylistsData: Playlist[] =
        publicPlaylistsRes.data.content.map((p: Playlist) => ({
          id: p.id,
          title: p.title,
          creator: p.username,
          thumbnailUrl: p.thumbnailUrl ?? null,
        }))

      setLikedTracks(tracksRes.slice(0, 10))
      setPublicPlaylists(publicPlaylistsData.slice(0, 10))
      setLikedPlaylists(likedPlaylistsRes.slice(0, 10))
      setStreak((streakRes as DailyTrackStreak).currentStreak)
    }

    fetchMyInfo()
    fetchTrackAndPlaylist()
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroMeta}>
            <div className={styles.heroLabel}>Profile</div>

            {isEditingName ? (
              <form className={styles.nameForm} onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="username"
                  value={draftUsername}
                  onChange={(e) => setDraftUsername(e.target.value)}
                  className={styles.nameInput}
                  autoFocus
                  required
                />
                <div className={styles.nameActions}>
                  <button type="submit" className={styles.primaryBtn}>
                    저장
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={handleCancelEdit}
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className={styles.nameButton}
                onClick={() => setIsEditingName(true)}
              >
                {username}
              </button>
            )}

            <p className={styles.heroDescription}>
              내가 모아둔 음악과 플레이리스트를 한눈에 살펴보세요.
            </p>

            <div className={styles.streakBadge}>🔥 {streak}일 연속 기록</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderText}>
              <h2 className={styles.sectionTitle}>내가 좋아하는 곡</h2>
              <p className={styles.sectionDescription}>
                자주 다시 듣고 싶은 곡들을 모아봤어요.
              </p>
            </div>
            <button className={styles.moreBtn} onClick={() => handleSection(1)}>
              더보기
            </button>
          </div>

          {likedTracks.length > 0 ? (
            <div className={styles.cardGrid}>
              {likedTracks.map((l) => (
                <article key={l.trackId} className={styles.mediaCard}>
                  <div className={styles.thumbnailWrap}>
                    <img
                      src={l.imageUrl || DEFAULT_THUMBNAIL}
                      alt={l.name}
                      className={styles.thumbnail}
                    />
                  </div>
                  <div className={styles.cardTitle}>{l.name}</div>
                  <div className={styles.cardMeta}>{l.artist}</div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>아직 좋아요한 곡이 없어요.</div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderText}>
              <h2 className={styles.sectionTitle}>나의 공개 플레이리스트</h2>
              <p className={styles.sectionDescription}>
                다른 사람들과 함께 듣고 싶은 플레이리스트예요.
              </p>
            </div>
            <button className={styles.moreBtn} onClick={() => handleSection(2)}>
              더보기
            </button>
          </div>

          {publicPlaylists.length > 0 ? (
            <div className={styles.cardGrid}>
              {publicPlaylists.map((p) => (
                <article
                  key={p.id}
                  className={styles.mediaCard}
                  onClick={() => handlePlaylistDetail(p.id)}
                >
                  <div className={styles.thumbnailWrap}>
                    <img
                      src={
                        p.thumbnailUrl
                          ? `${import.meta.env.VITE_API_URL}${p.thumbnailUrl}`
                          : DEFAULT_THUMBNAIL
                      }
                      alt={p.title}
                      className={styles.thumbnail}
                    />
                  </div>
                  <div className={styles.cardTitle}>{p.title}</div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              아직 공개 플레이리스트가 없어요.
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderText}>
              <h2 className={styles.sectionTitle}>
                내가 좋아하는 플레이리스트
              </h2>
              <p className={styles.sectionDescription}>
                마음에 들어 저장해둔 플레이리스트예요.
              </p>
            </div>
            <button className={styles.moreBtn} onClick={() => handleSection(3)}>
              더보기
            </button>
          </div>

          {likedPlaylists.length > 0 ? (
            <div className={styles.cardGrid}>
              {likedPlaylists.map((p) => (
                <article
                  key={p.playlistId ?? `${p.playlistTitle}-${p.username}`}
                  className={styles.mediaCard}
                  onClick={() => handlePlaylistDetail(p.playlistId)}
                >
                  <div className={styles.thumbnailWrap}>
                    <img
                      src={
                        p.thumbnailUrl
                          ? `${import.meta.env.VITE_API_URL}${p.thumbnailUrl}`
                          : DEFAULT_THUMBNAIL
                      }
                      alt={p.playlistTitle}
                      className={styles.thumbnail}
                    />
                  </div>
                  <div className={styles.cardTitle}>{p.playlistTitle}</div>
                  <div className={styles.cardMeta}>@{p.username}</div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              아직 좋아요한 플레이리스트가 없어요.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
