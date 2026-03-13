import { useEffect, useState, type ReactNode } from 'react'
import styles from './SearchItems.module.css'
import type { SpotifyTrack, Track } from '../../../types/track'
import LikeBtn from '../../../shared/components/LikeBtn'

export default function SearchItems({
  onLikeBtn,
  children,
  tracks,
  id,
  addTrack,
}: {
  onLikeBtn: boolean
  children?: (track: SpotifyTrack) => ReactNode
  id?: number | null
  tracks: Track | null
  addTrack?: (track: SpotifyTrack) => Promise<void>
}) {
  const [localTracks, setLocalTracks] = useState<Track | null>(tracks)
  useEffect(() => {
    setLocalTracks(tracks)
  }, [tracks])

  const handleSetLocalTracks = (liked: boolean, spotifyId: string) => {
    setLocalTracks((prev) => {
      if (!prev) return prev
      return {
        tracks: prev.tracks.map((item) => {
          return {
            track:
              item.track.spotifyId === spotifyId
                ? { ...item.track, liked: !liked }
                : item.track,
            artist: item.artist,
          }
        }),
      }
    })
  }

  return (
    <div className={styles.trackList}>
      {localTracks?.tracks.map((i) => (
        <div key={i.track.spotifyId} className={styles.trackRow}>
          <div className={styles.trackLeft}>
            <img
              src={i.track.imageUrl}
              alt={i.track.name}
              className={styles.trackThumb}
            />

            <div className={styles.trackMeta}>
              <div className={styles.trackName}>{i.track.name}</div>
              <div className={styles.trackArtist}>{i.track.artistName}</div>
            </div>
          </div>
          <div className={styles.trackActions}>
            {onLikeBtn ? (
              <LikeBtn
                isLike={i.track.liked}
                trackDto={{
                  spotifyId: i.track.spotifyId,
                  name: i.track.name,
                  artist: i.track.artistName,
                  album: i.track.album,
                  imageUrl: i.track.imageUrl,
                  durationMs: i.track.durationMs,
                }}
                handleSetLocalTracks={handleSetLocalTracks}
                className={styles.likeBtn}
              />
            ) : null}
            {children ? (
              <div className={styles.addAction}>{children(i.track)}</div>
            ) : id && addTrack ? (
              <button
                className={styles.addTextBtn}
                onClick={() => addTrack(i.track)}
              >
                추가
              </button>
            ) : null}
          </div>
          <div className={styles.trackDuration}>
            {Math.floor(i.track.durationMs / 60000)}:
            {Math.floor((i.track.durationMs % 60000) / 1000)
              .toString()
              .padStart(2, '0')}
          </div>
        </div>
      ))}
    </div>
  )
}
