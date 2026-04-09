import React from "react";
import Container from "../components/Container";

import { LibraryPageProps } from "../types/navigation.type";
import ToonVerseService from "../services/toonverse.service";
import Button from "../components/Button";
import { Text } from "react-native";
import styles from "../styles/styles";
import MangaDexService from "../services/mangadex.service";

const LibraryPage: React.FC<LibraryPageProps> = ({ navigation }) => {
  return (
    <Container withNavbar>
      <Text style={styles.text}>ToonVerse</Text>
      <Button
        onPress={() =>
          navigation.navigate("Manga", {
            slug: "solo-leveling",
            service: ToonVerseService,
          })
        }
      >
        Solo Leveling
      </Button>

      <Button
        onPress={() =>
          navigation.navigate("Manga", {
            slug: "shut-up-evil-dragon-i-dont-want-to-raise-a-child-with-you-anymore",
            service: ToonVerseService,
          })
        }
      >
        Shut up Evil Dragon
      </Button>

      <Button
        onPress={() =>
          navigation.navigate("Manga", {
            slug: "the-beginning-after-the-end",
            service: ToonVerseService,
          })
        }
      >
        The Beginning After The End
      </Button>

      <Text style={styles.text}>MangaDex</Text>

      <Button
        onPress={() =>
          navigation.navigate("Manga", {
            slug: "d41fe947-2e33-4b26-ac29-abc70fb08edb",
            service: MangaDexService,
          })
        }
      >
        Shut up Evil Dragon
      </Button>
    </Container>
  );
};

export default LibraryPage;
