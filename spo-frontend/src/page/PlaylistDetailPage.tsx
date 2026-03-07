import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
  deleteRequest,
  getRequestFeedDetails,
  getRequestTracks,
  updateRequestTitle,
  uploadRequestThumbnail,
} from '../features/request/api/RequestApi'
import styles from '../features/playlists/components/PlaylistDetail/PlaylistDetail.module.css'
import PlaylistEditModal from '../shared/modals/PlaylistEditModal'
import type { Track } from '../types/track'
import {
  deletePlaylist,
  getPlaylistDetails,
  getPlaylistTracks,
  updatePlaylistTitle,
  updatePlaylistVisibility,
  uploadPlaylistThumbnail,
} from '../features/playlists/api/PlaylistApi'
import type { RequestDetail } from '../types/request'
import type { Playlist, Visibility } from '../types/playlist'
import MenuModal from '../shared/modals/MenuModal'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuthStore } from '../shared/auth/authStore'
import { DEFAULT_REQUEST_THUMBNAIL, DEFAULT_THUMBNAIL } from '../utils/image'

type Source = 'playlist' | 'request'
type Detail = {
  userId: number
  username: string
  title: string
  thumbnailUrl: string | null
  visibility: Visibility
}
const isSource = (s: string | undefined): s is Source =>
  s === 'playlist' || s === 'request'

export default function PlaylistDetailPage() {
  const { source, id } = useParams()
  const numericId = Number(id)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const userId = useAuthStore((s) => s.userId)
  const isOwner = userId !== null && detail?.userId === userId

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { refreshPlaylists } = useOutletContext<{
    refreshPlaylists: () => void
    playlistVersion: number
  }>()
  const navigate = useNavigate()
  const thumbnailUrl = detail?.thumbnailUrl

  const srcThumbnailUrl = thumbnailUrl
    ? `${import.meta.env.VITE_API_URL}${thumbnailUrl}?v=${refreshKey}`
    : source === 'playlist'
      ? DEFAULT_THUMBNAIL
      : DEFAULT_REQUEST_THUMBNAIL

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)
  const reload = useCallback(async () => {
    if (!isSource(source) || !Number.isInteger(numericId) || numericId <= 0)
      return

    setIsLoading(true)
    try {
      if (source === 'request') {
        const [reqRes, traRes] = await Promise.all([
          getRequestFeedDetails(numericId),
          getRequestTracks(numericId),
        ])
        const req = reqRes.data as RequestDetail
        console.log('feed: ', req)

        setDetail({
          userId: req.userId,
          username: req.username,
          title: req.title,
          thumbnailUrl: req.thumbnailUrl ?? null,
          visibility: 'PUBLIC',
        })
        setTracks(traRes.data)
      } else if (source === 'playlist') {
        const [plsRes, traRes] = await Promise.all([
          getPlaylistDetails(numericId),
          getPlaylistTracks(numericId),
        ])
        const req = plsRes.data as Playlist

        setDetail({
          userId: req.userId,
          username: req.username,
          title: req.title,
          thumbnailUrl: req.thumbnailUrl ?? null,
          visibility: req.visibility,
        })
        setTracks(traRes.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [source, numericId])

  const uploadThumbnail = useCallback(
    async (file: File) => {
      if (!isSource(source) || !Number.isInteger(numericId) || numericId <= 0)
        return

      if (source === 'request') {
        await uploadRequestThumbnail(numericId, file)
      } else if (source === 'playlist') {
        await uploadPlaylistThumbnail(numericId, file)
      }
    },
    [numericId, source]
  )

  const updateTitle = useCallback(
    async (title: string) => {
      if (!isSource(source) || !Number.isInteger(numericId) || numericId <= 0)
        return

      if (source === 'request') {
        await updateRequestTitle(numericId, title)
      } else if (source === 'playlist') {
        await updatePlaylistTitle(numericId, title)
      }
    },
    [numericId, source]
  )

  const afterSave = useCallback(async () => {
    refreshPlaylists()
    await reload()
    setRefreshKey((k) => k + 1)
    closeModal()
  }, [refreshPlaylists, reload])

  const handleDeletePlaylist = async () => {
    if (isDeleting) return
    if (!isSource(source) || !Number.isInteger(numericId) || numericId <= 0)
      return
    if (!window.confirm('삭제하시겠습니까?')) return

    setIsDeleting(true)
    try {
      if (source === 'playlist') {
        await deletePlaylist(numericId)
      } else if (source === 'request') {
        await deleteRequest(numericId)
      }
      refreshPlaylists()
      navigate('/')
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleVisibility = async () => {
    if (!detail || source !== 'playlist') return
    const newVisibility = detail.visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'
    try {
      await updatePlaylistVisibility(numericId, newVisibility)
      setDetail((prev) =>
        prev ? { ...prev, visibility: newVisibility } : prev
      )
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    reload()
  }, [reload])

  if (isLoading) return <div>Loading</div>
  if (!detail) return <div>Not found</div>
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <img
            src={srcThumbnailUrl}
            alt=""
            className={styles.thumbnail}
            onClick={!isLoading && isOwner ? openModal : undefined}
          />

          <div className={styles.headerInfo}>
            <div className={styles.badge}>
              {source === 'playlist'
                ? detail.visibility === 'PRIVATE'
                  ? '비공개 플레이리스트'
                  : '공개 플레이리스트'
                : '플리 요청'}
            </div>
            <h2
              className={styles.detailTitle}
              onClick={!isLoading && isOwner ? openModal : undefined}
            >
              {detail?.title}
            </h2>

            <div className={styles.meta}>
              <span className={styles.metaUser}>{detail.username}</span>
              <span className={styles.dot}>•</span>
              <span>{tracks.length}곡</span>
            </div>

            {isOwner ? (
              <div className={styles.actions}>
                <MenuModal triggerName={'...'}>
                  <DropdownMenu.Content
                    className={styles.dropdownContent}
                    side="bottom"
                    align="end"
                    sideOffset={19}
                    collisionPadding={3}
                    sticky="always"
                  >
                    <DropdownMenu.Item asChild>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={handleDeletePlaylist}
                        disabled={isDeleting}
                      >
                        삭제하기
                      </button>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator
                      className={styles.dropdownSeparator}
                    />

                    {source === 'playlist' ? (
                      <DropdownMenu.Item asChild>
                        <button
                          type="button"
                          className={styles.menuItem}
                          onClick={handleVisibility}
                        >
                          {detail.visibility === 'PRIVATE'
                            ? '공개로 설정'
                            : '비공개로 설정'}
                        </button>
                      </DropdownMenu.Item>
                    ) : null}
                  </DropdownMenu.Content>
                </MenuModal>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.trackHeader}>
          <div className={styles.colIndex}>#</div>
          <div className={styles.colTitle}>제목</div>
          <div className={styles.colMeta}>아티스트</div>
          <div className={styles.colRight}>길이</div>
        </div>

        <div className={styles.trackList}>
          {tracks.map((track, idx) => {
            return (
              <div key={track.trackId} className={styles.trackRow}>
                <div className={styles.colIndex}>{idx + 1}</div>
                <div className={styles.colTitle}>
                  <div className={styles.trackName}>{track.name}</div>
                </div>
                <div className={styles.colMeta}>{track.artist ?? '-'}</div>
                <div className={styles.colRight}>
                  {Math.floor(track.durationMs / 60000)}:
                  {Math.floor((track.durationMs % 60000) / 1000)
                    .toString()
                    .padStart(2, '0')}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <PlaylistEditModal
        isOpen={modalOpen}
        onClose={closeModal}
        fileInputRef={fileInputRef}
        uploadThumbnail={uploadThumbnail}
        updateTitle={updateTitle}
        preview={srcThumbnailUrl}
        title={detail.title}
        onSave={afterSave}
      />
    </div>
  )
}
