import React, { useCallback, useEffect, useRef, useState } from "react";
import Container from "../components/Container";
import { ChapterPageProps } from "../types/navigation.type";
import { Chapter, ChapterPage as ChapterPageType } from "../types/manga.type";
import { Text, View } from "react-native";
import Button from "../components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MangaPage from "../modules/manga-page.module";
import styles from "../styles/styles";
import { FlashList, FlashListRef, FlashListProps } from "@shopify/flash-list";
import PageImage from "../components/PageImage";

const ChapterPage: React.FC<ChapterPageProps> = ({ route, navigation }) => {
  const { slug, chapterSlug, service } = route.params;

  const pageRef = useRef<MangaPage | null>(null);

  const [pages, setPages] = useState<ChapterPageType[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [showControls, setShowControls] = useState(false);

  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlashListRef<ChapterPageType>>(null);

  const getPages = useCallback(async () => {
    const page = pageRef.current!;
    const { pages, currentChapter, nextChapter, prevChapter } =
      await page.getChapterContent(chapterSlug);

    setPages(pages);
    setCurrentChapter(currentChapter ?? null);
    setNextChapter(nextChapter ?? null);
    setPrevChapter(prevChapter ?? null);
  }, [chapterSlug]);

  const clear = useCallback(() => {
    setPages([]);
    setCurrentChapter(null);
    setNextChapter(null);
    setPrevChapter(null);
    setShowControls(false);
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (!pageRef.current) {
      pageRef.current = new service(slug);
    }

    getPages();
  }, [chapterSlug]);

  const toggleControls = useCallback(() => setShowControls((old) => !old), []);

  return (
    <Container noSroll>
      <FlashList
        data={pages}
        ref={flatListRef}
        keyExtractor={(page) => page.id}
        renderItem={({ item: page, index }) => (
          <PageImage
            page={page}
            index={index}
            service={service}
            onTouchEnd={toggleControls}
          />
        )}
      />

      <View
        style={{
          display: showControls ? "flex" : "none",
          position: "absolute",
          top: insets.top,
          left: 0,
          padding: 8,
          backgroundColor: "#0000008a",
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onPress={() => navigation.navigate("Manga", { slug, service })}>
          Back
        </Button>
        <Text style={[styles.text, { flex: 1, textAlign: "center" }]}>
          {currentChapter?.title}
        </Text>
      </View>
      {prevChapter && (
        <Button
          style={{
            display: showControls ? "flex" : "none",
            position: "absolute",
            bottom: insets.bottom + 8,
            left: 8,
          }}
          onPress={() => {
            clear();
            navigation.navigate("Chapter", {
              slug,
              service,
              chapterSlug: prevChapter.slug,
            });
          }}
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
          onPress={() => {
            clear();
            navigation.navigate("Chapter", {
              slug,
              service,
              chapterSlug: nextChapter.slug,
            });
          }}
        >
          Next
        </Button>
      )}
    </Container>
  );
};

export default ChapterPage;
