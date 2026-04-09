import React from "react";
import Container from "../components/Container";
import { BrowsingPageProps } from "../types/navigation.type";
import { MangaPageConstructor } from "../types/manga.type";
import AsuraScansService from "../services/asurascans.service";
import { v4 as uuidv4 } from "uuid";
import MangaBuddyService from "../services/mangabuddy.service";
import MangaDexService from "../services/mangadex.service";
import ToonVerseService from "../services/toonverse.service";
import styles from "../styles/styles";
import { Text, TouchableOpacity, View } from "react-native";
import { Image as RNImage } from "expo-image";

const BrowsingPage: React.FC<BrowsingPageProps> = () => {
  const services: { id: string; service: MangaPageConstructor }[] = [
    { id: uuidv4(), service: AsuraScansService },
    { id: uuidv4(), service: MangaBuddyService },
    { id: uuidv4(), service: MangaDexService },
    { id: uuidv4(), service: ToonVerseService },
  ];

  return (
    <Container withNavbar>
      <Text style={styles.text}>Browsing</Text>

      <View style={{ display: "flex", gap: 8 }}>
        {services.map(({ id, service }) => (
          <TouchableOpacity
            key={id}
            style={styles.mangaServiceItem}
            onPress={() => console.log(service.referer)}
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
          </TouchableOpacity>
        ))}
      </View>
    </Container>
  );
};

export default BrowsingPage;
