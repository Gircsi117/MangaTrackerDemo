import React, { useCallback, useEffect, useState } from "react";
import Container from "../../components/Container";
import { MangaPageProps } from "../../types/navigation.type";
import { Chapter, Manga } from "../../types/manga.type";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import styles, { colors } from "../../styles/styles";
import Button from "../../components/Button";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { Linking } from "react-native";
import Image from "../../components/Image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MangaPage: React.FC<MangaPageProps> = ({ route, navigation }) => {
  const { slug, service } = route.params;

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

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

  const renderMangaDetail = useCallback(
    (icon: React.JSX.Element, text: string) => (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Text style={styles.textMuted}>{icon}</Text>
        <Text style={styles.textMuted}>{text}</Text>
      </View>
    ),
    [],
  );

  return (
    <Container withNavbar edges={[]}>
      <View
        style={{
          width: width,
          height: 300,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Image
          contentFit="cover"
          source={{
            uri: manga?.coverUrl,
            headers: service.headers,
          }}
          transition={200}
          style={{
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
            opacity: 0.5,
          }}
          blurRadius={10}
        />
        <LinearGradient
          colors={["transparent", colors.background]}
          style={StyleSheet.absoluteFill}
          locations={[0, 1]}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          marginTop: insets.top,
        }}
      >
        <Button
          variant="ghost"
          onPress={() => navigation.navigate("Search", { service })}
        >
          <Ionicons name="arrow-back" size={20} color={colors.fontMuted} />
        </Button>

        <View style={{ flex: 1 }} />

        <Button
          variant="ghost"
          onPress={() => Linking.openURL(new service(slug).mangaUrl)}
        >
          <Feather name="external-link" size={18} color={colors.fontMuted} />
        </Button>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <Image
          defaultAspectRatio={2 / 3}
          contentFit="fill"
          source={{
            uri: manga?.coverUrl,
            headers: service.headers,
          }}
          transition={200}
          style={{ borderRadius: 12, flex: 1 }}
        />
        <View style={{ flex: 2 }}>
          <Text
            style={[
              styles.text,
              { fontSize: 22, fontWeight: "700", marginBottom: 8 },
            ]}
          >
            {manga?.title}
          </Text>
          <View style={{ display: "flex", gap: 4 }}>
            {renderMangaDetail(
              <Feather name="user" size={16} />,
              manga?.author || "Unknown",
            )}
            {renderMangaDetail(
              <Feather name="book" size={16} />,
              manga?.type || "Unknown",
            )}
            {renderMangaDetail(
              <FontAwesome5 name="sourcetree" size={16} />,
              service.name,
            )}
          </View>
        </View>
      </View>
      <Text
        style={[
          styles.text,
          { lineHeight: 22, marginBottom: 20, color: "#cccccc" },
        ]}
      >
        {manga?.description}
      </Text>

      {chapters.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={[
              styles.textMuted,
              {
                flex: 1,
                fontSize: 12,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              },
            ]}
          >
            {chapters.length} fejezet
          </Text>
          <Button
            onPress={() => setChapters((old) => [...old].reverse())}
            variant="ghost"
          >
            <Ionicons name="swap-vertical" size={20} color={colors.fontMuted} />
          </Button>
        </View>
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
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 11,
            paddingHorizontal: 12,
            marginBottom: 4,
            backgroundColor: colors.surface,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 10,
          }}
        >
          <View
            style={{
              backgroundColor: colors.primary + "28",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
              minWidth: 44,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {chapter.number}
            </Text>
          </View>
          <Text
            style={[styles.text, { flex: 1, fontSize: 13 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {chapter.title}
          </Text>
          {chapter.publishedAt && (
            <Text
              style={{ color: colors.fontMuted, fontSize: 11, flexShrink: 0 }}
            >
              {new Date(chapter.publishedAt).toLocaleDateString("hu-HU")}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </Container>
  );
};

export default MangaPage;
