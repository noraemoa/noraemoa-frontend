import type { Track, TrackCreateRequestDto } from '../../../../types/track'
import SearchItems from '../../../search/components/SearchItems'
import styles from '../../../../shared/styles/SearchPanel.module.css'

interface DailyTrackSearchPanelProps {
  searchTracks: Track | null
  searchModalOpen: boolean
  handleCloseSearch: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  isSubmitted: boolean
  setSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleSaveTodayTrack: (dto: TrackCreateRequestDto) => Promise<void>
}

export default function DailyTrackSearchPanel({
  searchTracks,
  searchModalOpen,
  handleCloseSearch,
  handleSubmit,
  search,
  setSearch,
  isSubmitted,
  setSearchModalOpen,
  handleSaveTodayTrack,
}: DailyTrackSearchPanelProps) {
  return (
    <div className={styles.bottom}>
      {searchModalOpen ? (
        <div className={styles.searchPanel}>
          <div className={styles.searchPanelHeader}>
            <div className={styles.searchPanelTitle}>검색창</div>
            <button
              type="button"
              className={styles.searchCloseBtn}
              onClick={handleCloseSearch}
            >
              ×
            </button>
          </div>
          <form className={styles.searchForm} onSubmit={handleSubmit}>
            <input
              className={styles.searchInput}
              type="text"
              name="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="어떤 노래를 듣고 싶으세요?"
              required
            />
            <button
              type="submit"
              disabled={isSubmitted}
              style={{ display: 'none' }}
            >
              검색
            </button>
          </form>

          <SearchItems onLikeBtn={true} tracks={searchTracks}>
            {(track) => (
              <button
                key={track.spotifyId}
                type="button"
                className={styles.dailyTrackAddBtn}
                onClick={() =>
                  handleSaveTodayTrack({
                    spotifyId: track.spotifyId,
                    name: track.name,
                    artist: track.artistName,
                    album: track.album,
                    imageUrl: track.imageUrl,
                    durationMs: track.durationMs,
                  })
                }
              >
                +
              </button>
            )}
          </SearchItems>
        </div>
      ) : (
        <button
          type="button"
          className={styles.searchOpenBtn}
          onClick={() => setSearchModalOpen((s) => !s)}
        >
          오늘의 노래 찾아보기
        </button>
      )}
    </div>
  )
}
