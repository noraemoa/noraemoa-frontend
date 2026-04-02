import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { SectionItem } from "../../../../types/section";
import { sections } from "../../config/section.config";
import styles from "./SectionPage.module.css";
import { DEFAULT_THUMBNAIL, resolveImageUrl } from "../../../../utils/image";
import type { YesterdayDailyTrack } from "../../../../types/dailyTrack";

export default function SectionPage() {
  const { playlistVersion } = useOutletContext<{
    refreshPlaylists: () => void;
    playlistVersion: number;
  }>();

  const { id } = useParams();
  const sectionId = Number(id) - 1;
  const navigate = useNavigate();
  const [sectionItems, setSectionItems] = useState<SectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const section = sections.at(sectionId);

  const handlePlaylist = (playlistId: number) => {
    navigate(`/detail/playlist/${playlistId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!section) return;
        const res = await section.fetch();
        if (section.kind === "daily-track") {
          const data = res as YesterdayDailyTrack[];
          setSectionItems(
            data.map((d) => ({
              id: d.id,
              creator: d.username,
              thumbnailUrl: d.imageUrl,
              title: d.name,
            })),
          );
        } else {
          setSectionItems(res as SectionItem[]);
        }
      } catch (error) {
        console.error(error);
        setSectionItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [section]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.label}>Section</div>
          <h1 className={styles.title}>{section?.title ?? "플레이리스트"}</h1>
          <p className={styles.description}>
            지금 분위기에 맞는 플레이리스트를 한곳에서 둘러보세요.
          </p>
        </div>
      </section>

      <section className={styles.contentPanel}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.sectionTitle}>
              {section?.title ?? "플레이리스트"}
            </h2>
            <p className={styles.sectionDescription}>
              저장해둔 플레이리스트를 넓게 살펴볼 수 있어요.
            </p>
          </div>

          <div className={styles.count}>{sectionItems.length} playlists</div>
        </div>

        {isLoading ? (
          <div className={styles.empty}>플레이리스트를 불러오는 중이에요.</div>
        ) : sectionItems.length === 0 ? (
          <div className={styles.empty}>아직 표시할 플레이리스트가 없어요.</div>
        ) : (
          <div className={styles.grid}>
            {sectionItems.map((item) => {
              const srcThumbnailUrl = item.thumbnailUrl
                ? `${resolveImageUrl(item.thumbnailUrl)}?v=${playlistVersion}`
                : DEFAULT_THUMBNAIL;
              return (
                <div
                  key={item.id}
                  className={styles.card}
                  onClick={() => handlePlaylist(item.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.thumbnailWrap}>
                    {section?.kind === "daily-track" ? (
                      <img
                        src={srcThumbnailUrl}
                        alt={item.title}
                        className={styles.thumbnail}
                      />
                    ) : (
                      <img
                        src={srcThumbnailUrl}
                        alt={item.title}
                        className={styles.thumbnail}
                      />
                    )}
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.creator}>@{item.creator}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
