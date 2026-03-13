import styles from './MainHero.module.css'

export default function MainHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.label}>NoraeMoa</div>
          <h1 className={styles.title}>지금 듣고 싶은 노래를 찾아보세요</h1>
          <p className={styles.description}>
            인기 플레이리스트를 둘러보고, 오늘의 한 곡과 함께 나만의 음악 취향을
            기록해보세요.
          </p>
        </div>
      </div>
    </section>
  )
}
