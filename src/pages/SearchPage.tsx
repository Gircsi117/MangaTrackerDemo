import React, { use, useCallback, useEffect, useRef, useState } from "react";
import Container from "../components/Container";
import { SearchPageProps } from "../types/navigation.type";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles, { colors } from "../styles/styles";
import { Image as RNImage } from "expo-image";
import Button from "../components/Button";
import useSearch from "../hooks/useSearch";
import { Entypo } from "@expo/vector-icons";

const SearchPage: React.FC<SearchPageProps> = ({ route, navigation }) => {
  const { service } = route.params;
  const {
    search,
    query,
    setQuery,
    page,
    totalPages,
    mangas,
    handleSearch,
    handlePageChange,
    clearSearch,
  } = useSearch(service);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    search();
  }, []);

  return (
    <Container withNavbar scrollRef={scrollRef}>
      <View
        style={[
          styles.mangaServiceItem,
          { marginBottom: 8, backgroundColor: "transparent" },
        ]}
      >
        <RNImage
          source={{
            uri: service.logoUrl,
            headers: {
              Referer: service.referer,
              "User-Agent": service.userAgent,
            },
          }}
          style={{ width: 50, aspectRatio: 1 }}
        />
        <Text style={[styles.text, { fontSize: 16, fontWeight: "bold" }]}>
          {service.name}
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="Keresés..."
          placeholderTextColor="#aaa"
          returnKeyType="search"
          style={styles.input}
        />

        <Button
          onPress={clearSearch}
          style={{ display: query ? "flex" : "none", width: 60 }}
        >
          <Entypo name="cross" size={18} color={colors.font} />
        </Button>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {mangas.map((manga) => (
          <TouchableOpacity
            key={String(manga.id)}
            style={{ width: "48.5%" }}
            onPress={() =>
              navigation.navigate("Manga", {
                slug: manga.slug,
                service,
              })
            }
          >
            <RNImage
              source={{
                uri: manga.coverUrl,
                headers: {
                  Origin: service.referer,
                  Referer: service.referer,
                  "User-Agent": service.userAgent,
                },
              }}
              style={[
                styles.image,
                { width: "100%", aspectRatio: "2/3", borderRadius: 8 },
              ]}
              contentFit="cover"
              recyclingKey={String(manga.id)}
              transition={300}
            />
            <Text
              style={[styles.text, { marginTop: 4, fontSize: 12 }]}
              numberOfLines={2}
            >
              {manga.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {totalPages > 1 && (
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <Text style={[styles.text, { marginBottom: 8, color: "#aaa" }]}>
            {page} / {totalPages} oldal
          </Text>
          <FlatList
            horizontal
            data={Array.from({ length: totalPages }, (_, i) => i + 1)}
            keyExtractor={(p) => String(p)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, marginTop: 16, marginBottom: 8 }}
            renderItem={({ item: p }) => (
              <TouchableOpacity
                onPress={() => {
                  scrollRef.current?.scrollTo({ y: 0, animated: true });
                  handlePageChange(p);
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: p === page ? colors.primary : "#585858",
                }}
              >
                <Text style={styles.text}>{p}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </Container>
  );
};

export default SearchPage;
