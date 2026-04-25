import React, { useCallback, useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import { ChapterPageProps } from "../../types/navigation.type";
import { Chapter, ChapterPage as ChapterPageType } from "../../types/manga.type";
import { FlatList, ImageSize, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MangaPage from "../../modules/manga-page.module";
import PageImage from "../../components/PageImage";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button";
import styles from "../../styles/styles";

type ChapterState = {
  pages: ChapterPageType[];
  currentChapter: Chapter | null;
  nextChapter: Chapter | null;
  prevChapter: Chapter | null;
};

const EMPTY_STATE: ChapterState = {
  pages: [],
  currentChapter: null,
  nextChapter: null,
  prevChapter: null,
};

const ChapterPage: React.FC<ChapterPageProps> = ({ route, navigation }) => {
  const { slug, chapterSlug, service } = route.params;

  const pageRef = useRef<MangaPage | null>(null);
  const pageSizes = useRef<Record<string, ImageSize>>({});
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [state, setState] = useState<ChapterState>(EMPTY_STATE);
  const [showControls, setShowControls] = useState(false);

  const { pages, currentChapter, nextChapter, prevChapter } = state;

  const getPages = useCallback(async () => {
    const { pages, currentChapter, nextChapter, prevChapter } =
      await pageRef.current!.getChapterContent(chapterSlug);

    setState({
      pages,
      currentChapter: currentChapter ?? null,
      nextChapter: nextChapter ?? null,
      prevChapter: prevChapter ?? null,
    });
  }, [chapterSlug]);

  const clear = useCallback(() => {
    setState(EMPTY_STATE);
    setShowControls(false);
    pageSizes.current = {};
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (!pageRef.current) {
      pageRef.current = new service(slug);
    }
    getPages();
  }, [chapterSlug]);

  const toggleControls = useCallback(() => setShowControls((old) => !old), []);

  const onSizeLoad = useCallback(
    (id: string, width: number, height: number) => {
      pageSizes.current[id] = { width, height };

      if (updateTimeout.current) clearTimeout(updateTimeout.current);
      updateTimeout.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          pages: prev.pages.map((p) =>
            pageSizes.current[p.id] ? { ...p, ...pageSizes.current[p.id] } : p,
          ),
        }));
      }, 200);
    },
    [],
  );

  const renderItem = useCallback(
    ({ item: page, index }: { item: ChapterPageType; index: number }) => (
      <PageImage
        page={page}
        index={index}
        service={service}
        onTouchEnd={toggleControls}
        onSizeLoad={onSizeLoad}
      />
    ),
    [toggleControls, service, onSizeLoad],
  );

  return (
    <Container noSroll>
      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(page) => page.id}
        initialNumToRender={5}
        windowSize={7}
        maxToRenderPerBatch={5}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        renderItem={renderItem}
      />

      {showControls && (
        <>
          {/* Top bar */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              paddingTop: insets.top + 8,
              paddingBottom: 12,
              paddingHorizontal: 12,
              backgroundColor: "#000000c0",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Button
              style={styles.navButton}
              onPress={() => navigation.navigate("Manga", { slug, service })}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </Button>

            <Text
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 14,
                fontWeight: "600",
                textAlign: "center",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentChapter?.title}
            </Text>

            <View style={{ width: 38 }} />
          </View>

          {/* Bottom bar */}
          {(prevChapter || nextChapter) && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: insets.bottom + 10,
                paddingTop: 12,
                paddingHorizontal: 16,
                backgroundColor: "#000000c0",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {prevChapter ? (
                <Button
                  style={styles.navButton}
                  onPress={() => {
                    clear();
                    navigation.navigate("Chapter", {
                      slug,
                      service,
                      chapterSlug: prevChapter.slug,
                    });
                  }}
                >
                  <Ionicons name="chevron-back" size={16} color="#fff" />
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
                    Előző
                  </Text>
                </Button>
              ) : (
                <View />
              )}

              {nextChapter ? (
                <Button
                  style={styles.navButton}
                  onPress={() => {
                    clear();
                    navigation.navigate("Chapter", {
                      slug,
                      service,
                      chapterSlug: nextChapter.slug,
                    });
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
                    Következő
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#fff" />
                </Button>
              ) : (
                <View />
              )}
            </View>
          )}
        </>
      )}
    </Container>
  );
};

export default ChapterPage;
