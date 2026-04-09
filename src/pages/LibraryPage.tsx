import React from "react";
import Container from "../components/Container";
import { Text } from "react-native";
import styles from "../styles/styles";
import { LibraryPageProps } from "../types/navigation.types";

const LibraryPage: React.FC<LibraryPageProps> = () => {
  return (
    <Container withNavbar>
      <Text style={styles.text}>Library</Text>
    </Container>
  );
};

export default LibraryPage;
