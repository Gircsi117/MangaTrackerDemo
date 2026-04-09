import React from "react";
import Container from "../components/Container";
import { Text } from "react-native";
import styles from "../styles/styles";
import { SettingsPageProps } from "../types/navigation.type";

const SettingsPage: React.FC<SettingsPageProps> = () => {
  return (
    <Container withNavbar>
      <Text style={styles.text}>Settings</Text>
    </Container>
  );
};

export default SettingsPage;
