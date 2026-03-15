import { useNavigate } from 'react-router-dom'
import styles from './SectionCard.module.css'
import type { SectionItem } from '../../../../types/section'
import { useEffect, useState } from 'react'
import { sections } from '../../config/section.config'
import type { YesterdayDailyTrack } from '../../../../types/dailyTrack'
import PlaylistResSectionCard from '../PlaylistResSectionCard/PlaylistResSectionCard'
import DailyTrackResSectionCard from '../DailyTrackResSectionCard/DailyTrackResSectionCard'

interface SectionCardProps {
  sectionId: number
  playlistVersion: number
  featured?: boolean
}

type responseType = SectionItem | YesterdayDailyTrack

export default function SectionCard({
  sectionId,
  playlistVersion,
  featured = false,
}: SectionCardProps) {
  const sectionIdx = sectionId - 1
  const [items, setItems] = useState<responseType[]>([])
  const navigate = useNavigate()

  const handleSection = (id: number) => {
    navigate(`/section/${id}`)
  }

  const handlePlaylist = (playlistId: number) => {
    navigate(`/detail/playlist/${playlistId}`)
  }
  const section = sections.at(sectionIdx)
  useEffect(() => {
    const fetchData = async () => {
      if (!section) return
      const res = await section.fetch()
      setItems(res.slice(0, 10))
    }
    fetchData()
  }, [section])

  const sectionTitle = sections.at(sectionIdx)?.title ?? ''
  const sectionDescription = sections.at(sectionIdx)?.description ?? ''

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
        {section?.kind === 'daily-track' ? (
          <DailyTrackResSectionCard
            items={items as YesterdayDailyTrack[]}
            featured={featured}
          />
        ) : (
          <PlaylistResSectionCard
            items={items as SectionItem[]}
            featured={featured}
            handlePlaylist={handlePlaylist}
            playlistVersion={playlistVersion}
          />
        )}
      </div>
    </section>
  )
}
