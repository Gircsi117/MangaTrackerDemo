import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { MangaPageProps } from "../types/navigation.type";
import { Chapter, Manga } from "../types/manga.type";
import { Text, TouchableOpacity, View } from "react-native";
import { Image as RNImage } from "expo-image";
import styles from "../styles/styles";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";

const MangaPage: React.FC<MangaPageProps> = ({ route, navigation }) => {
  const { slug, service } = route.params;

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [aspectRatio, setAspectRatio] = useState("2/3");

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
      <RNImage
        source={{
          uri: manga?.coverUrl,
          headers: {
            Referer: service.referer,
            "User-Agent": service.userAgent,
          },
        }}
        style={{
          ...styles.image,
          aspectRatio: aspectRatio,
        }}
        contentFit="contain"
        recyclingKey={manga?.id}
        onLoad={(e) => {
          const { width, height } = e.source;
          setAspectRatio(`${width}/${height}`);
        }}
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
      <Text style={[styles.text, { lineHeight: 22, marginBottom: 16 }]}>
        {manga?.description}
      </Text>

      {chapters.length > 0 && (
        <Button
          onPress={() => setChapters((old) => [...old].reverse())}
          style={{ marginBottom: 12, marginLeft: "auto" }}
        >
          <Ionicons name="swap-vertical" size={24} color="#fff" />
        </Button>
      )}

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
