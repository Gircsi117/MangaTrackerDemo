import React from "react";
import Container from "../components/Container";
import { Text } from "react-native";
import styles from "../styles/styles";
import { HistoryPageProps } from "../types/navigation.type";

const HistoryPage: React.FC<HistoryPageProps> = () => {
  return (
    <Container withNavbar>
      <Text style={styles.text}>History</Text>
    </Container>
  );
};

export default HistoryPage;
