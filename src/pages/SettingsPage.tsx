import React from "react";
import Container from "../components/Container";
import { SettingsPageProps } from "../types/navigation.type";
import Button from "../components/Button";
import DrizzleDB from "../db/db";

const SettingsPage: React.FC<SettingsPageProps> = ({ navigation }) => {
  return (
    <Container withNavbar>
      <Button onPress={() => navigation.navigate("Credentials")}>
        Credentials
      </Button>

      <Button onPress={() => navigation.navigate("Category")}>Category</Button>
      <Button onPress={() => DrizzleDB.exportMainData()}>Export DB Data</Button>
    </Container>
  );
};

export default SettingsPage;
