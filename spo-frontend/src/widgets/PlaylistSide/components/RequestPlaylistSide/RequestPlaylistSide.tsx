import type { Request } from '../../../../types/request'
import { DEFAULT_REQUEST_THUMBNAIL } from '../../../../utils/image'
import styles from '../shared/SidebarList.module.css'
import { NavLink } from 'react-router-dom'

interface RequestPlaylistSideProps {
  requests: Request[]
  sidebarOpen: boolean
  playlistVersion: number
}

export default function RequestPlaylistSide({
  requests,
  sidebarOpen,
  playlistVersion,
}: RequestPlaylistSideProps) {
  return (
    <div className={styles.list}>
      {sidebarOpen && (
        <div className={styles.listMeta}>{requests.length} requests</div>
      )}

      {requests.map((request) => (
        <NavLink
          key={request.id}
          to={`/detail/request/${request.id}`}
          title={!sidebarOpen ? request.title : undefined}
          className={({ isActive }) =>
            `${styles.itemLink} ${isActive ? styles.active : ''}`
          }
        >
          <div
            className={`${styles.item} ${!sidebarOpen ? styles.collapsedItem : ''}`}
          >
            <img
              src={
                request.thumbnailUrl
                  ? `${import.meta.env.VITE_API_URL}${request.thumbnailUrl}?v=${playlistVersion}`
                  : DEFAULT_REQUEST_THUMBNAIL
              }
              alt={request.title}
              className={styles.thumbnail}
            />

            {sidebarOpen && (
              <span className={styles.itemText}>{request.title}</span>
            )}
          </div>
        </NavLink>
      ))}
    </div>
  )
}
