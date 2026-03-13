import { NavLink } from 'react-router-dom'
import styles from './PageTabs.module.css'

export default function PageTabs() {
  return (
    <>
      <div className={styles.tabs}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          모두
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          플레이리스트
        </NavLink>

        <NavLink
          to="/community"
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          플리 요청함
        </NavLink>

        <NavLink
          to="/today"
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          오늘의 한 곡
        </NavLink>
      </div>

      <hr className={styles.divider} />
    </>
  )
}
