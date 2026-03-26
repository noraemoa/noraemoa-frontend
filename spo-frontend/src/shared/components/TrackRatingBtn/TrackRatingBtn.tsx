import { useState } from 'react'
import styles from './TrackRatingBtn.module.css'

interface TrackRatingBtnProps {
  rating: number
  onRate: (value: number) => void
  className?: string
}

const STARS = [1, 2, 3, 4, 5]

export default function TrackRatingBtn({
  rating,
  onRate,
  className,
}: TrackRatingBtnProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  return (
    <div className={`${styles.rating} ${className ?? ''}`} data-rating-root>
      <div
        className={styles.collapsed}
        data-rating-collapsed
        aria-hidden="true"
      >
        <span className={styles.singleStar}>★</span>
      </div>

      <div
        className={styles.expanded}
        data-rating-expanded
        onMouseLeave={() => setHoveredStar(null)}
      >
        {STARS.map((star) => {
          const isFilledByRating = rating >= star
          const isFilledByHover = hoveredStar !== null && hoveredStar >= star

          return (
            <button
              key={star}
              type="button"
              className={styles.starButton}
              onMouseEnter={() => setHoveredStar(star)}
              onClick={(e) => {
                e.stopPropagation()
                onRate(star)
              }}
              aria-label={`${star}점 주기`}
            >
              <span
                className={`${styles.star} ${
                  isFilledByHover || (hoveredStar === null && isFilledByRating)
                    ? styles.filled
                    : ''
                }`}
              >
                ★
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
