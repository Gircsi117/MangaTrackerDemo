import React from "react";
import Container from "../components/Container";
import { BrowsingPageProps } from "../types/navigation.type";
import { MangaPageConstructor } from "../types/manga.type";
import AsuraScansService from "../services/asurascans.service";
import MangaBuddyService from "../services/mangabuddy.service";
import MangaDexHuService from "../services/mangadex-hu.service";
import ToonVerseService from "../services/toonverse.service";
import styles from "../styles/styles";
import { Text, TouchableOpacity, View } from "react-native";
import { Image as RNImage } from "expo-image";
import PadlizsanFanSubService from "../services/padlizsanfansub.service";
import MangaDexEnService from "../services/mangadex-en.service";
import NHentaiService from "../services/nhentai.service";
import Image from "../components/Image";
import ManhwaManiaService from "../services/manhwamania.service";

const BrowsingPage: React.FC<BrowsingPageProps> = ({ navigation }) => {
  const services: MangaPageConstructor[] = [
    AsuraScansService,
    MangaBuddyService,
    MangaDexHuService,
    MangaDexEnService,
    ToonVerseService,
    PadlizsanFanSubService,
    NHentaiService,
    ManhwaManiaService,
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container withNavbar>
      <View style={{ display: "flex", gap: 8 }}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.mangaServiceItem}
            onPress={() => navigation.navigate("Search", { service })}
          >
            <Image
              source={{
                uri: service.logoUrl,
                headers: service.headers,
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
