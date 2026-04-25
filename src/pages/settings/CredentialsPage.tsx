import React from "react";
import Container from "../../components/Container";
import { CredentialsPageProps } from "../../types/navigation.type";
import { Text, View } from "react-native";
import styles from "../../styles/styles";
import CredentialSetter from "../../components/CredentialSetter";
import PadlizsanFanSubService from "../../services/manga_services/padlizsanfansub.service";
import KecskeFanSubService from "../../services/manga_services/kecskefansub.service";
import mangaServicesRegistry from "../../registry/manga-services.registry";

const CredentialsPage: React.FC<CredentialsPageProps> = () => {
  const services = mangaServicesRegistry.filter((x) => x.needLogin);

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
        {services.map((x) => (
          <CredentialSetter key={x.id} id={x.id} name={x.name} />
        ))}
      </View>
    </Container>
  );
};

export default CredentialsPage;
