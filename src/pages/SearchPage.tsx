import React, { useEffect, useRef } from "react";
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
import Button from "../components/Button";
import useSearch from "../hooks/useSearch";
import { Entypo } from "@expo/vector-icons";
import Image from "../components/Image";

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
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Image
          source={{
            uri: service.logoUrl,
            headers: service.headers,
          }}
          style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: undefined }}
        />
        <Text style={[styles.text, { fontSize: 18, fontWeight: "700" }]}>
          {service.name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="Keresés..."
          placeholderTextColor={colors.fontMuted}
          returnKeyType="search"
          style={styles.input}
        />
        {!!query && (
          <Button onPress={clearSearch} style={{ width: 46, paddingHorizontal: 0 }}>
            <Entypo name="cross" size={18} color={colors.font} />
          </Button>
        )}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {mangas.map((manga) => (
          <TouchableOpacity
            key={String(manga.id)}
            style={{ width: "48%" }}
            onPress={() =>
              navigation.navigate("Manga", {
                slug: manga.slug,
                service,
              })
            }
          >
            <View
              style={{
                borderRadius: 10,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Image
                source={{
                  uri: manga.coverUrl,
                  headers: service.headers,
                }}
                style={[styles.image, { aspectRatio: 2 / 3 }]}
                recyclingKey={String(manga.id)}
                transition={200}
              />
            </View>
            <Text
              style={[styles.text, { marginTop: 6, fontSize: 12 }]}
              numberOfLines={2}
            >
              {manga.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {totalPages > 1 && (
        <View style={{ marginTop: 20, marginBottom: 8 }}>
          <Text style={[styles.textMuted, { marginBottom: 10, fontSize: 13 }]}>
            {page} / {totalPages} oldal
          </Text>
          <FlatList
            horizontal
            data={Array.from({ length: totalPages }, (_, i) => i + 1)}
            keyExtractor={(p) => String(p)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            renderItem={({ item: p }) => (
              <TouchableOpacity
                onPress={() => {
                  scrollRef.current?.scrollTo({ y: 0, animated: true });
                  handlePageChange(p);
                }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: p === page ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: p === page ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={[
                    styles.text,
                    { fontSize: 13, fontWeight: p === page ? "700" : "400" },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </Container>
  );
};

export default SearchPage;
