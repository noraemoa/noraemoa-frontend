import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { SectionItem } from '../../../../types/section'
import { sections } from '../../config/section.config'
import styles from './SectionPage.module.css'
import { DEFAULT_THUMBNAIL } from '../../../../utils/image'

export default function SectionPage() {
  const { playlistVersion } = useOutletContext<{
    refreshPlaylists: () => void
    playlistVersion: number
  }>()
  const { id } = useParams()
  const sectionId = Number(id) - 1
  const navigate = useNavigate()
  const [sectionItems, setSectionItems] = useState<SectionItem[]>([])
  const handlePlaylist = (playlistId: number) => {
    navigate(`/detail/playlist/${playlistId}`)
  }
  useEffect(() => {
    const fetchData = async () => {
      const section = sections.at(sectionId)
      if (!section) return
      const res = await section.fetch()
      setSectionItems(res)
    }
    fetchData()
  }, [sectionId])

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{sections.at(sectionId)?.title}</h1>
      <div className={styles.grid}>
        {sectionItems.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => handlePlaylist(item.id)}
            role="button"
            tabIndex={0}
          >
            <img
              src={
                item.thumbnailUrl
                  ? `${import.meta.env.VITE_API_URL}${item.thumbnailUrl}?v=${playlistVersion}`
                  : DEFAULT_THUMBNAIL
              }
              alt=""
              className={styles.thumbnail}
            />
            <div className={styles.meta}>
              <div className={styles.itemTitle}>{item.title}</div>
              <div className={styles.creator}>{item.creator}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
