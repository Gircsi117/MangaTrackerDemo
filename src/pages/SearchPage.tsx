import React, { use, useEffect, useState } from "react";
import Container from "../components/Container";
import { SearchPageProps } from "../types/navigation.type";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/styles";
import { Manga } from "../types/manga.type";
import { Image } from "expo-image";

const SearchPage: React.FC<SearchPageProps> = ({ route, navigation }) => {
  const { service } = route.params;
  const [mangas, setMangas] = useState<Manga[]>([]);

  useEffect(() => {
    const search = async () => {
      const result = await service.search({ query: "solo" });
      console.log(result);

      setMangas(result.items);
    };

    search();
  }, []);

  return (
    <Container withNavbar>
      <Text style={styles.text}>Search</Text>

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
