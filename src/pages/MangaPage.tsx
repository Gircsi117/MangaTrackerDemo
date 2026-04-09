import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { MangaPageProps } from "../types/navigation.type";
import { Chapter, Manga } from "../types/manga.type";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/styles";

const MangaPage: React.FC<MangaPageProps> = ({ route, navigation }) => {
  const { slug, service } = route.params;

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const getManga = async () => {
      const page = new service(slug);
      const manga = await page.getManga();
      const chapters = await page.getChapters();

      setManga(manga);
      setChapters(chapters);
    };

    getManga();
  }, []);

  return (
    <Container withNavbar>
      <Image
        source={{ uri: manga?.coverUrl }}
        style={{ width: "100%", aspectRatio: "2/3", borderRadius: 8 }}
      />
      <Text
        style={[
          styles.text,
          { fontSize: 24, fontWeight: "bold", marginTop: 12 },
        ]}
      >
        {manga?.title}
      </Text>
      <Text style={[styles.text, { color: "#aaa", marginBottom: 8 }]}>
        {manga?.author} • {manga?.type}
      </Text>
      <Text style={[styles.text, { lineHeight: 22 }]}>
        {manga?.description}
      </Text>
      {chapters.map((chapter) => (
        <TouchableOpacity
          key={chapter.id}
          onPress={() =>
            navigation.navigate("Chapter", {
              slug: manga?.slug || "",
              chapterSlug: chapter.slug,
              service: service,
            })
          }
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 8,
              marginBottom: 4,
              backgroundColor: "#2a2a2a",
              borderRadius: 8,
            }}
          >
            <Text style={styles.text}>
              {chapter.number}. {chapter.title}
            </Text>
            {chapter.publishedAt && (
              <Text style={[styles.text, { color: "#aaa", fontSize: 12 }]}>
                {new Date(chapter.publishedAt).toLocaleDateString("hu-HU")}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </Container>
  );
};

export default MangaPage;
