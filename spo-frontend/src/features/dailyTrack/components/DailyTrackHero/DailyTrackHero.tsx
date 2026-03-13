import { PLUS_THUMBNAIL } from '../../../../utils/image'
import styles from './DailyTrackHero.module.css'

interface DailyTrackHerolProps {
  today: string
  todayTrackImageUrl?: string
  todayTrackName?: string
  todayTrackArtistName?: string
}
export default function DailyTrackHero({
  today,
  todayTrackImageUrl,
  todayTrackName,
  todayTrackArtistName,
}: DailyTrackHerolProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <div className={styles.label}>Daily Track</div>
          <h1 className={styles.title}>오늘의 한 곡</h1>
          <div className={styles.date}>{today}</div>
          <p className={styles.description}>
            오늘 하루를 가장 잘 설명하는 노래를 남겨보세요.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.thumbnailWrap}>
            <img
              src={todayTrackImageUrl ?? PLUS_THUMBNAIL}
              alt={todayTrackName ?? 'empty daily track'}
              className={styles.thumbnail}
            />
          </div>

          <div className={styles.meta}>
            <div className={styles.trackName}>
              {todayTrackName ?? '아직 오늘의 곡이 없어요'}
            </div>
            <div className={styles.artistName}>
              {todayTrackArtistName ?? '오늘의 분위기를 담아보세요'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
