import { IoHeart } from 'react-icons/io5'
import styles from './LikeBtn.module.css'
import type { TrackCreateRequestDto } from '../../types/track'
import {
  addTrackLike,
  deleteTrackLike,
} from '../../features/track/api/TrackApi'
interface LikeBtnProps {
  isLike: boolean
  trackDto: TrackCreateRequestDto
  handleSetLocalTracks: (liked: boolean, spotifyId: string) => void
  className?: string
}
export default function TrackLikeBtn({
  isLike,
  trackDto,
  handleSetLocalTracks,
  className,
}: LikeBtnProps) {
  const toggleLike = async (liked: boolean, dto: TrackCreateRequestDto) => {
    try {
      if (liked) {
        await deleteTrackLike(dto.spotifyId)
      } else {
        await addTrackLike(dto)
      }

      handleSetLocalTracks(liked, dto.spotifyId)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <button
      className={`${styles.triggerBtn} ${className ?? ''}`}
      onClick={() => toggleLike(isLike, trackDto)}
    >
      <IoHeart color={isLike ? 'red' : 'white'} size={22} />
    </button>
  )
}
