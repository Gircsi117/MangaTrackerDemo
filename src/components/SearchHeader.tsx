import React, { memo, useCallback, useState } from "react";
import { MangaPageConstructor } from "../types/manga.type";
import { Text, TextInput, View } from "react-native";
import styles, { colors } from "../styles/styles";
import Image from "./Image";
import Button from "./Button";
import { Entypo } from "@expo/vector-icons";

type SearchHeaderProps = {
  service: MangaPageConstructor;
  onSearch: (query: string) => void;
  onClear: () => void;
};

const SearchHeader = memo(
  ({ service, onSearch, onClear }: SearchHeaderProps) => {
    const [value, setValue] = useState("");

    const handleSubmit = useCallback(() => {
      onSearch(value);
    }, [value, onSearch]);

    const handleClear = useCallback(() => {
      setValue("");
      onClear();
    }, [onClear]);

    return (
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
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: undefined,
            }}
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
            value={value}
            onChangeText={setValue}
            onSubmitEditing={handleSubmit}
            placeholder="Keresés..."
            placeholderTextColor={colors.fontMuted}
            returnKeyType="search"
            style={styles.input}
          />
          {!!value && (
            <Button
              onPress={handleClear}
              style={{ width: 46, paddingHorizontal: 0 }}
            >
              <Entypo name="cross" size={18} color={colors.font} />
            </Button>
          )}
        </View>
      </View>
    );
  },
);

export default SearchHeader;
