import { useNavigate, useParams } from 'react-router-dom'
import styles from './ProfileSectionPage.module.css'
import { useEffect, useState } from 'react'
import { type ProfileSectionItem } from '../../../types/section'
import { profileSections } from '../config/profileSection.config'
import type { LikedTrackItem } from '../../../types/track'
import type { LikedPlaylist, Playlist } from '../../../types/playlist'
import { DEFAULT_THUMBNAIL } from '../../../utils/image'

export default function ProfileSectionPage() {
  const { id } = useParams()
  const sectionId = Number(id) - 1
  const [sectionItems, setSectionItems] = useState<ProfileSectionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const section = profileSections.at(sectionId)
  const navigate = useNavigate()

  const handleDetail = (id: number) => {
    if (section?.title !== 'liked-track') navigate(`/detail/playlist/${id}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        if (!section) return
        const res = await section.fetch()

        if (section.kind === 'liked-track') {
          const data = res as LikedTrackItem[]
          setSectionItems(
            data.map((d) => ({
              id: d.trackId,
              name: d.name,
              artist: d.artist,
              imageUrl: d.imageUrl,
            }))
          )
        } else if (section.kind === 'public-playlist') {
          const data = res as Playlist[]
          setSectionItems(
            data.map((d) => ({
              id: d.id,
              name: d.title,
              imageUrl: d.thumbnailUrl,
            }))
          )
        } else if (section.kind === 'liked-playlist') {
          const data = res as LikedPlaylist[]
          setSectionItems(
            data.map((d) => ({
              id: d.playlistId,
              name: d.playlistTitle,
              creator: d.username,
              imageUrl: d.thumbnailUrl,
            }))
          )
        }
      } catch (error) {
        console.error(error)
        setSectionItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [section])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLabel}>Profile</div>
          <h1 className={styles.heroTitle}>{section?.title ?? '더보기'}</h1>
          <p className={styles.heroDescription}>
            {section?.description ??
              '저장해둔 음악과 플레이리스트를 살펴보세요.'}
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.contentInner}>
          {isLoading ? (
            <div className={styles.empty}>불러오는 중이에요.</div>
          ) : sectionItems.length === 0 ? (
            <div className={styles.empty}>아직 표시할 게 없어요.</div>
          ) : (
            <div className={styles.grid}>
              {sectionItems.map((item) => (
                <article
                  key={item.id}
                  className={styles.card}
                  onClick={() => handleDetail(item.id)}
                >
                  <div className={styles.thumbnailWrap}>
                    {section?.kind === 'liked-track' ? (
                      <img
                        src={item.imageUrl || DEFAULT_THUMBNAIL}
                        alt={item.name}
                        className={styles.thumbnail}
                      />
                    ) : (
                      <img
                        src={
                          item.imageUrl
                            ? `${import.meta.env.VITE_API_URL}${item.imageUrl}`
                            : DEFAULT_THUMBNAIL
                        }
                        alt={item.name}
                        className={styles.thumbnail}
                      />
                    )}
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.itemTitle}>{item.name}</div>

                    {section?.kind === 'liked-track' ? (
                      <div className={styles.subText}>{item.artist}</div>
                    ) : section?.kind === 'liked-playlist' ? (
                      <div className={styles.subText}>@{item.creator}</div>
                    ) : (
                      <div className={styles.subText}>공개 플레이리스트</div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
