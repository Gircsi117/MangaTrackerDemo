import React from "react";
import Container from "../../components/Container";
import { BrowsingPageProps } from "../../types/navigation.type";
import { MangaPageConstructor } from "../../types/manga.type";
import AsuraScansService from "../../services/asurascans.service";
import MangaBuddyService from "../../services/mangabuddy.service";
import MangaDexHuService from "../../services/mangadex-hu.service";
import ToonVerseService from "../../services/toonverse.service";
import styles, { colors } from "../../styles/styles";
import { Text, TouchableOpacity, View } from "react-native";
import PadlizsanFanSubService from "../../services/padlizsanfansub.service";
import MangaDexEnService from "../../services/mangadex-en.service";
import NHentaiService from "../../services/nhentai.service";
import Image from "../../components/Image";
import ManhwaManiaService from "../../services/manhwamania.service";
import { Ionicons } from "@expo/vector-icons";
import KecskeFanSubService from "../../services/kecskefansub.service";

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
    KecskeFanSubService,
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container withNavbar>
      <Text style={styles.sectionHeader}>Források</Text>
      <View style={[styles.card, { marginTop: 0 }]}>
        {services.map((service, index) => (
          <React.Fragment key={service.id}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate("Search", { service })}
            >
              <Image
                source={{
                  uri: service.logoUrl,
                  headers: service.headers,
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: undefined,
                }}
              />
              <Text
                style={[
                  styles.text,
                  { flex: 1, fontSize: 15, fontWeight: "600" },
                ]}
              >
                {service.name}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.fontMuted}
              />
            </TouchableOpacity>
            {index < services.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </Container>
  );
};

export default BrowsingPage;
