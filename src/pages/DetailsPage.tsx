import React from "react";
import Container from "../components/Container";
import { Text } from "react-native";
import { DetailsPageProps } from "../types/navigation.types";
import styles from "../styles/style";

const DetailsPage: React.FC<DetailsPageProps> = ({ route, navigation }) => {
  const name = route.params?.name;

  return (
    <Container withNavbar>
      <Text style={styles.text}>Details - {name || "Nincs"}</Text>
    </Container>
  );
};

export default DetailsPage;
