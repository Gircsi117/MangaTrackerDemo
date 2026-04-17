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
import PadlizsanFanSubService from "../services/padlizsanfansub.service";

const BrowsingPage: React.FC<BrowsingPageProps> = ({ navigation }) => {
  const services: MangaPageConstructor[] = [
    AsuraScansService,
    MangaBuddyService,
    MangaDexService,
    ToonVerseService,
    PadlizsanFanSubService,
  ];

  return (
    <Container withNavbar>
      <View style={{ display: "flex", gap: 8 }}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.mangaServiceItem}
            onPress={() => navigation.navigate("Search", { service })}
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
