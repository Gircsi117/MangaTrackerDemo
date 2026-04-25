import React from "react";
import Container from "../../components/Container";
import { BrowsingPageProps } from "../../types/navigation.type";
import styles, { colors } from "../../styles/styles";
import { Text, TouchableOpacity, View } from "react-native";
import Image from "../../components/Image";
import { Ionicons } from "@expo/vector-icons";
import mangaServicesRegistry from "../../registry/manga-services.registry";

const BrowsingPage: React.FC<BrowsingPageProps> = ({ navigation }) => {
  return (
    <Container withNavbar>
      <Text style={styles.sectionHeader}>Források</Text>
      <View style={[styles.card, { marginTop: 0 }]}>
        {mangaServicesRegistry.map((service, index) => (
          <React.Fragment key={service.id}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate("Search", { service })}
            >
              <Image
                source={{
                  uri: service.logoUrl,
                  headers: service.headers,
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: undefined,
                }}
              />
              <Text
                style={[
                  styles.text,
                  { flex: 1, fontSize: 15, fontWeight: "600" },
                ]}
              >
                {service.name}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.fontMuted}
              />
            </TouchableOpacity>
            {index < mangaServicesRegistry.length - 1 && (
              <View style={styles.separator} />
            )}
          </React.Fragment>
        ))}
      </View>
    </Container>
  );
};

export default BrowsingPage;
