import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import styles from './DetailTrackSection.module.css'
import type { Track } from '../../../../types/track'
import {
  getTrackMenuActions,
  type TrackMenuAction,
} from '../../policies/trackMenuActions'
import { useEffect, useState } from 'react'
import LikeBtn from '../../../../shared/components/LikeBtn'

interface DetailTrackSectionProps {
  source: string | null
  isOwner: boolean
  tracks: Track | null
  deleteTrack: (trackId: number) => Promise<void>
}

export default function DetailTrackSection({
  source,
  isOwner,
  tracks,
  deleteTrack,
}: DetailTrackSectionProps) {
  const [localTracks, setLocalTracks] = useState<Track | null>(tracks)
  useEffect(() => {
    setLocalTracks(tracks)
  }, [tracks])

  const handleSetLocalTracks = (liked: boolean, spotifyId: string) => {
    setLocalTracks((prev) => {
      if (!prev?.tracks) return prev

      return {
        ...prev,
        tracks: prev.tracks.map((item) => ({
          track:
            item.track.spotifyId === spotifyId
              ? { ...item.track, liked: !liked }
              : item.track,
          artist: item.artist,
        })),
      }
    })
  }

  return (
    <div className={styles.body}>
      <div className={styles.trackHeader}>
        <div className={styles.colIndex}>#</div>
        <div className={styles.colTitle}>제목</div>
        <div className={styles.colMeta}>아티스트</div>
        <div className={styles.colRight}>길이</div>
        <div className={styles.colLike}></div>
        <div className={styles.colMore}></div>
      </div>

      <div className={styles.trackList}>
        {localTracks?.tracks?.map((track, idx) => {
          const actions: TrackMenuAction[] = getTrackMenuActions({
            source,
            isOwner,
            trackId: track.track.trackId ?? null,
            onDeleteTrack: deleteTrack,
          })
          return (
            <div key={track.track.trackId} className={styles.trackRow}>
              <div className={styles.colIndex}>{idx + 1}</div>
              <div className={styles.colTitle}>
                <div className={styles.trackName}>{track.track.name}</div>
              </div>
              <div className={styles.colMeta}>
                {track.track.artistName ?? '-'}
              </div>
              <div className={styles.colRight}>
                <span className={styles.duration}>
                  {Math.floor(track.track.durationMs / 60000)}:
                  {Math.floor((track.track.durationMs % 60000) / 1000)
                    .toString()
                    .padStart(2, '0')}
                </span>
              </div>

              <LikeBtn
                isLike={track.track.liked}
                trackDto={{
                  spotifyId: track.track.spotifyId,
                  name: track.track.name,
                  artist: track.artist?.name,
                  album: track.track.album,
                  imageUrl: track.track.imageUrl,
                  durationMs: track.track.durationMs,
                }}
                handleSetLocalTracks={handleSetLocalTracks}
                className={styles.likeBtn}
              />

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className={styles.moreButton}>•••</button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                  className={styles.dropdownContent}
                  side="bottom"
                  align="end"
                  sideOffset={19}
                  collisionPadding={3}
                  sticky="always"
                >
                  {actions.map((a) => (
                    <DropdownMenu.Item asChild key={a.key}>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={a.onSelect}
                      >
                        {a.label}
                      </button>
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator
                    className={styles.dropdownSeparator}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          )
        })}
      </div>
    </div>
  )
}
