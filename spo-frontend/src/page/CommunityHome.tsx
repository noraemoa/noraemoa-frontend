import { useEffect, useState } from 'react'
import type { RequestFeedItem } from '../types/request'
import { getAllRequests } from '../features/request/api/RequestApi'
import { DEFAULT_REQUEST_THUMBNAIL } from '../utils/image'
import styles from '../features/community/components/CommunityHome/CommunityHome.module.css'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { formatFeedTime } from '../utils/time'
import PageTabs from '../shared/components/PageTabs'

export default function CommunityHome() {
  const { playlistVersion } = useOutletContext<{
    refreshPlaylists: () => void
    playlistVersion: number
  }>()
  const [requests, setRequests] = useState<RequestFeedItem[]>([])
  const navigate = useNavigate()

  const fetchData = async () => {
    const res = await getAllRequests()
    const map: RequestFeedItem[] = (res.data as RequestFeedItem[]).map((r) => ({
      id: r.id,
      username: r.username,
      title: r.title,
      thumbnailUrl: r.thumbnailUrl,
      keywords: r.keywords,
      trackCount: r.trackCount,
      createdAt: r.createdAt,
    }))
    setRequests(map)
  }

  const handleFeed = (id: number) => {
    navigate(`/detail/request/${id}`)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={styles.container}>
      <PageTabs />
      {requests.map((request) => (
        <div
          key={request.id}
          className={styles.card}
          onClick={() => handleFeed(request.id)}
        >
          <img
            src={
              request.thumbnailUrl
                ? `${import.meta.env.VITE_API_URL}${request.thumbnailUrl}?v=${playlistVersion}`
                : DEFAULT_REQUEST_THUMBNAIL
            }
            alt=""
            className={styles.thumbnail}
          />
          <div className={styles.content}>
            <div className={styles.title}>{request.title}</div>
            <div className={styles.keywords}>
              {request.keywords?.map((k) => (
                <span key={k.id} className={styles.keyword}>
                  {k.rawText}
                </span>
              ))}
            </div>

            <div className={styles.meta}>
              <span>{request.trackCount}곡</span>
              <span>{formatFeedTime(request.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
