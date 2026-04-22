import React, { useCallback, useEffect, useRef } from "react";
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
import { Manga } from "../types/manga.type";

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

  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    search();
  }, []);

  const handlePagePress = useCallback(
    (p: number) => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
      handlePageChange(p);
    },
    [handlePageChange],
  );

  const renderItem = useCallback(
    ({ item: manga }: { item: Manga }) => (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate("Manga", { slug: manga.slug, service })
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
            source={{ uri: manga.coverUrl, headers: service.headers }}
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
    ),
    [navigation, service],
  );

  const ListHeader = (
    <View>
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
          source={{ uri: service.logoUrl, headers: service.headers }}
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
    </View>
  );

  const ListFooter =
    totalPages > 1 ? (
      <View style={{ marginTop: 20, marginBottom: 8 }}>
        <Text style={[styles.textMuted, { marginBottom: 10, fontSize: 13 }]}>
          {page} / {totalPages} oldal
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => handlePagePress(p)}
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
          ))}
        </ScrollView>
      </View>
    ) : null;

  return (
    <Container withNavbar noSroll>
      <FlatList
        ref={listRef}
        data={mangas}
        keyExtractor={(manga) => String(manga.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 12 }}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
      />
    </Container>
  );
};

export default SearchPage;
