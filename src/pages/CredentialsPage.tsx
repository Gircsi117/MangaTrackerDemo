import React from "react";
import Container from "../components/Container";
import { CredentialsPageProps } from "../types/navigation.type";
import { Text, View } from "react-native";
import styles from "../styles/styles";
import CredentialSetter from "../components/CredentialSetter";
import PadlizsanFanSubService from "../services/padlizsanfansub.service";
import KecskeFanSubService from "../services/kecskefansub.service";

const CredentialsPage: React.FC<CredentialsPageProps> = () => {
  return (
    <Container withNavbar>
      <Text
        style={[
          styles.text,
          { fontSize: 24, fontWeight: "700", marginBottom: 4 },
        ]}
      >
        Bejelentkezési adatok
      </Text>
      <Text style={[styles.textMuted, { marginBottom: 20 }]}>
        Felhasználónév és jelszó kezelése
      </Text>

      <View style={{ display: "flex", gap: 16 }}>
        <CredentialSetter
          id={PadlizsanFanSubService.id}
          name={PadlizsanFanSubService.name}
        />

        <CredentialSetter
          id={KecskeFanSubService.id}
          name={KecskeFanSubService.name}
        />
      </View>
    </Container>
  );
};

export default CredentialsPage;
