import React from "react";
import { Text } from "react-native";
import styles from "../styles/style";
import Container from "../components/Container";

const HomePage = () => {
  return (
    <Container withNavbar>
      <Text style={styles.text}>Almaaa</Text>
      <Text style={styles.text}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      </Text>
    </Container>
  );
};

export default HomePage;
