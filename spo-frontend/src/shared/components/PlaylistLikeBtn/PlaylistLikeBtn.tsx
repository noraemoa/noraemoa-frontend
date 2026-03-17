import { IoHeart } from 'react-icons/io5'
import {
  addPlaylistLike,
  deletePlaylistLike,
} from '../../../features/playlists/api/PlaylistApi'
import styles from './PlaylistLikeBtn.module.css'
interface PlaylistLikeBtnProps {
  isLike: boolean
  playlistId: number | null
  className?: string
  setLiked: React.Dispatch<React.SetStateAction<boolean>>
}
export default function PlaylistLikeBtn({
  isLike,
  playlistId,
  className,
  setLiked,
}: PlaylistLikeBtnProps) {
  const toggleLike = async (liked: boolean, playlistId: number) => {
    try {
      if (liked) {
        await deletePlaylistLike(playlistId)
      } else {
        await addPlaylistLike(playlistId)
      }
      setLiked(!liked)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <>
      {playlistId ? (
        <button
          className={`${styles.triggerBtn} ${className ?? ''}`}
          onClick={() => toggleLike(isLike, playlistId)}
        >
          <IoHeart color={isLike ? '#FF7A7A' : '#D8D9DA'} size={20} />
        </button>
      ) : null}
    </>
  )
}
