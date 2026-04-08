import React from "react";
import { Text } from "react-native";
import styles from "../styles/styles";
import Container from "../components/Container";
import { HomePageProps } from "../types/navigation.types";

const HomePage: React.FC<HomePageProps> = ({ route, navigation }) => {
  return (
    <Container withNavbar>
      <Text style={styles.text}>Almaaa</Text>
    </Container>
  );
};

export default HomePage;
