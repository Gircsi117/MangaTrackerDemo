import React from "react";
import Container from "../components/Container";
import { Text } from "react-native";
import styles from "../styles/styles";
import { SettingsPageProps } from "../types/navigation.type";
import Button from "../components/Button";

const SettingsPage: React.FC<SettingsPageProps> = ({ navigation }) => {
  return (
    <Container withNavbar>
      <Button onPress={() => navigation.navigate("Credentials")}>
        Credentials
      </Button>
    </Container>
  );
};

export default SettingsPage;
