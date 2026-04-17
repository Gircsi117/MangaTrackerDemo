import React, { useEffect, useRef, useState } from "react";
import Container from "../components/Container";
import { ChapterPageProps } from "../types/navigation.type";
import { Chapter, ChapterPage as ChapterPageType } from "../types/manga.type";
import { Image as RNImage } from "expo-image";
import { FlatList } from "react-native";
import Button from "../components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MangaPage from "../modules/manga-page.module";

const ChapterPage: React.FC<ChapterPageProps> = ({ route, navigation }) => {
  const { slug, chapterSlug, service } = route.params;

  const pageRef = useRef<MangaPage | null>(null);

  const [pages, setPages] = useState<ChapterPageType[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [showControls, setShowControls] = useState(false);

  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setPages([]);
    setShowControls(false);
    setCurrentChapter(null);
    setNextChapter(null);
    setPrevChapter(null);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    pageRef.current = pageRef.current ?? new service(slug);

    const getPages = async () => {
      const page = pageRef.current!;
      const { pages, currentChapter, nextChapter, prevChapter } =
        await page.getChapterContent(chapterSlug);

      setPages(pages);
      setCurrentChapter(currentChapter ?? null);
      setNextChapter(nextChapter ?? null);
      setPrevChapter(prevChapter ?? null);
    };

    getPages();
  }, [chapterSlug]);

  return (
    <Container noSroll>
      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(page) => page.id}
        renderItem={({ item: page }) => (
          <RNImage
            source={{
              uri: page.imageUrl,
              headers: {
                Referer: service.referer,
                "User-Agent": service.userAgent,
              },
            }}
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: `${page.width}/${page.height}`,
            }}
            contentFit="contain"
            recyclingKey={page.id}
            onLoad={(e) => {
              const { width, height } = e.source;
              setPages((prev) =>
                prev.map((p) =>
                  p.id === page.id ? { ...p, width, height } : p,
                ),
              );
            }}
            onTouchEnd={() => setShowControls((old) => !old)}
          />
        )}
      />

      <Button
        style={{
          display: showControls ? "flex" : "none",
          position: "absolute",
          top: insets.top + 8,
          left: 8,
        }}
        onPress={() => navigation.navigate("Manga", { slug, service })}
      >
        Back
      </Button>
      {prevChapter && (
        <Button
          style={{
            display: showControls ? "flex" : "none",
            position: "absolute",
            bottom: insets.bottom + 8,
            left: 8,
          }}
          onPress={() =>
            navigation.navigate("Chapter", {
              slug,
              service,
              chapterSlug: prevChapter.slug,
            })
          }
        >
          Prev
        </Button>
      )}
      {nextChapter && (
        <Button
          style={{
            display: showControls ? "flex" : "none",
            position: "absolute",
            bottom: insets.bottom + 8,
            right: 8,
          }}
          onPress={() =>
            navigation.navigate("Chapter", {
              slug,
              service,
              chapterSlug: nextChapter.slug,
            })
          }
        >
          Next
        </Button>
      )}
    </Container>
  );
};

export default ChapterPage;
