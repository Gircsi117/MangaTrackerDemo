import React from "react";
import Container from "../components/Container";
import { CredentialsPageProps } from "../types/navigation.type";
import { Text } from "react-native";
import styles from "../styles/styles";
import CredentialSetter from "../components/CredentialSetter";
import PadlizsanFanSubService from "../services/padlizsanfansub.service";

const CredentialsPage: React.FC<CredentialsPageProps> = () => {
  return (
    <Container withNavbar>
      <Text style={[styles.text, { fontSize: 24, fontWeight: "700", marginBottom: 4 }]}>
        Bejelentkezési adatok
      </Text>
      <Text style={[styles.textMuted, { marginBottom: 20 }]}>
        Felhasználónév és jelszó kezelése
      </Text>

      <CredentialSetter
        id={PadlizsanFanSubService.id}
        name={PadlizsanFanSubService.name}
      />
    </Container>
  );
};

export default CredentialsPage;
