import React from "react";
import Container from "../components/Container";

import { LibraryPageProps } from "../types/navigation.type";
import ToonVerseService from "../services/toonverse.service";
import Button from "../components/Button";

const LibraryPage: React.FC<LibraryPageProps> = ({ navigation }) => {
  return (
    <Container withNavbar>
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
    </Container>
  );
};

export default LibraryPage;
