import { useOutletContext } from 'react-router-dom'
import SectionCard from '../features/home/components/SectionCard/SectionCard'
import { AuthOnly, GuestOnly } from '../shared/components/AuthVisibility'
import styles from '../features/home/components/HomePage.module.css'
import PageTabs from '../shared/components/PageTabs'

const authOnlySections = [1, 2, 3, 4, 5]
const guestOnlySections = [1, 6, 3, 4]

export default function HomePage() {
  const { playlistVersion } = useOutletContext<{
    refreshPlaylists: () => void
    playlistVersion: number
  }>()

  return (
    <div className={styles.container}>
      <PageTabs />

      <AuthOnly>
        {authOnlySections.map((section) => (
          <div key={section}>
            <SectionCard
              key={section}
              sectionId={section}
              playlistVersion={playlistVersion}
            />
          </div>
        ))}
      </AuthOnly>
      <GuestOnly>
        {guestOnlySections.map((section) => (
          <div key={section}>
            <SectionCard
              key={section}
              sectionId={section}
              playlistVersion={playlistVersion}
            />
          </div>
        ))}
      </GuestOnly>
    </div>
  )
}
