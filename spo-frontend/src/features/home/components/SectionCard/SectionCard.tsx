import { useNavigate } from 'react-router-dom'
import styles from './SectionCard.module.css'
import type { SectionItem } from '../../../../types/section'
import { useEffect, useState } from 'react'
import { sections } from '../../config/section.config'
import { DEFAULT_THUMBNAIL } from '../../../../utils/image'

interface SectionCardProps {
  sectionId: number
  playlistVersion: number
  featured?: boolean
}

export default function SectionCard({
  sectionId,
  playlistVersion,
  featured = false,
}: SectionCardProps) {
  const sectionIdx = sectionId - 1
  const [items, setItems] = useState<SectionItem[]>([])
  const navigate = useNavigate()

  const handleSection = (id: number) => {
    navigate(`/section/${id}`)
  }

  const handlePlaylist = (playlistId: number) => {
    navigate(`/detail/playlist/${playlistId}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      const section = sections.at(sectionIdx)
      if (!section) return
      const res = await section.fetch()
      setItems(res.slice(0, 10))
    }
    fetchData()
  }, [sectionIdx])

  const sectionTitle = sections.at(sectionIdx)?.title ?? ''
  const sectionDescription = featured
    ? '지금 많은 사람들이 저장하고 있는 플레이리스트예요.'
    : '지금 바로 둘러볼 수 있는 플레이리스트 모음이에요.'

  return (
    <section
      className={`${styles.section} ${featured ? styles.featuredSection : ''}`}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.headerText}>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
          <p className={styles.sectionDescription}>{sectionDescription}</p>
        </div>

        <button
          className={styles.moreBtn}
          onClick={() => handleSection(sectionId)}
        >
          더보기
        </button>
      </div>

      <div className={`${styles.list} ${featured ? styles.featuredList : ''}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${featured ? styles.featuredCard : ''}`}
            onClick={() => handlePlaylist(item.id)}
          >
            <div className={styles.thumbnailWrap}>
              <img
                src={
                  item.thumbnailUrl
                    ? `${import.meta.env.VITE_API_URL}${item.thumbnailUrl}?v=${playlistVersion}`
                    : DEFAULT_THUMBNAIL
                }
                alt={item.title}
                className={styles.thumbnail}
              />
            </div>

            <div className={styles.title}>{item.title}</div>
            <div className={styles.creator}>{item.creator}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
