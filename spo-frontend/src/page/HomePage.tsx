import { useOutletContext } from 'react-router-dom'
import SectionCard from '../features/home/components/SectionCard/SectionCard'
import { AuthOnly, GuestOnly } from '../shared/components/AuthVisibility'
import styles from '../features/home/components/HomePage.module.css'
import PageTabs from '../shared/components/PageTabs'
import MainHero from '../features/home/components/MainHero/MainHero'

const authOnlySections = [1, 2, 3, 4, 5]
const guestOnlySections = [1, 6, 3, 4]

export default function HomePage() {
  const { playlistVersion } = useOutletContext<{
    refreshPlaylists: () => void
    playlistVersion: number
  }>()

  return (
    <div className={styles.container}>
      <MainHero />
      <div className={styles.tabsWrap}>
        <PageTabs />
      </div>

      <div className={styles.sections}>
        <AuthOnly>
          {authOnlySections.map((section, index) => (
            <SectionCard
              key={section}
              sectionId={section}
              playlistVersion={playlistVersion}
              featured={index === 0}
            />
          ))}
        </AuthOnly>

        <GuestOnly>
          {guestOnlySections.map((section, index) => (
            <SectionCard
              key={section}
              sectionId={section}
              playlistVersion={playlistVersion}
              featured={index === 0}
            />
          ))}
        </GuestOnly>
      </div>
    </div>
  )
}
