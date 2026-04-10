import React, { use, useEffect, useState } from "react";
import Container from "../components/Container";
import { SearchPageProps } from "../types/navigation.type";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles/styles";
import { Manga } from "../types/manga.type";
import { Image } from "expo-image";
import Button from "../components/Button";

const SearchPage: React.FC<SearchPageProps> = ({ route, navigation }) => {
  const { service } = route.params;
  const [query, setQuery] = useState("");
  const [mangas, setMangas] = useState<Manga[]>([]);

  const search = async () => {
    const result = await service.search({ query: query.trim() });

    console.log(service.name, result);

    setMangas(result.items);
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <Container withNavbar>
      <Text style={styles.text}>Search</Text>

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
          onSubmitEditing={search}
          placeholder="Keresés..."
          placeholderTextColor="#aaa"
          returnKeyType="search"
          style={styles.input}
        />
        <Button onPress={search}>Search</Button>
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
            <Image
              source={{
                uri: manga.coverUrl,
                headers: {
                  Origin: service.referer,
                  Referer: service.referer,
                  "User-Agent": service.userAgent,
                },
              }}
              style={{ width: "100%", aspectRatio: "2/3", borderRadius: 8 }}
              contentFit="cover"
              recyclingKey={String(manga.id)}
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
    </Container>
  );
};

export default SearchPage;
