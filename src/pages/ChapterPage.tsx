import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { ChapterPageProps } from "../types/navigation.type";
import { ChapterPage as ChapterPageType } from "../types/manga.type";
import { Image as RNImage } from "expo-image";
import { FlatList } from "react-native";

const ChapterPage: React.FC<ChapterPageProps> = ({ route }) => {
  const { slug, chapterSlug, service } = route.params;
  const [pages, setPages] = useState<ChapterPageType[]>([]);

  useEffect(() => {
    const getPages = async () => {
      const page = new service(slug);
      const pages = await page.getChapterPages(chapterSlug);

      setPages(pages);
    };

    getPages();
  }, []);

  return (
    <Container noSroll>
      <FlatList
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
          />
        )}
      />
    </Container>
  );
};

export default ChapterPage;
