import type React from 'react'
import type { Detail } from '../../../../page/PlaylistDetailPage'
import styles from './DetailHero.module.css'
import { useEffect, useState } from 'react'
import PlaylistLikeBtn from '../../../../shared/components/PlaylistLikeBtn/PlaylistLikeBtn'

interface DetailHeroProps {
  playlistId: number | null
  srcThumbnailUrl: string
  onEditClick?: () => void
  isOwner: boolean
  source: string | null
  detail: Detail
  trackCount: number
  moreSlot?: React.ReactNode
}
export default function DetailHero({
  playlistId,
  srcThumbnailUrl,
  onEditClick,
  isOwner,
  source,
  detail,
  trackCount,
  moreSlot,
}: DetailHeroProps) {
  const [liked, setLiked] = useState(false)
  useEffect(() => {
    setLiked(detail?.liked ?? false)
  }, [detail])
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <img
          src={srcThumbnailUrl}
          alt=""
          className={styles.thumbnail}
          onClick={isOwner ? onEditClick : undefined}
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
            onClick={isOwner ? onEditClick : undefined}
          >
            {detail?.title}
          </h2>
          <div className={styles.meta}>
            <span className={styles.metaUser}>{detail.username}</span>
            <span className={styles.dot}>•</span>
            <span>{trackCount}곡</span>
          </div>

          <div className={styles.actionRow}>
            {moreSlot}
            <PlaylistLikeBtn
              isLike={liked}
              playlistId={playlistId}
              className={styles.likeBtn}
              setLiked={setLiked}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
