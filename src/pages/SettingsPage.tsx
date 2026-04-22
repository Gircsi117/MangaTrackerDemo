import React from "react";
import Container from "../components/Container";
import { SettingsPageProps } from "../types/navigation.type";
import DrizzleDB from "../db/db";
import { Text, TouchableOpacity, View } from "react-native";
import styles, { colors } from "../styles/styles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SettingsPage: React.FC<SettingsPageProps> = ({ navigation }) => {
  return (
    <Container withNavbar>
      <Text style={styles.sectionHeader}>Fiók</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Credentials")}
        >
          <MaterialIcons name="vpn-key" size={20} color={colors.fontMuted} />
          <Text style={[styles.text, { flex: 1, fontSize: 15 }]}>
            Bejelentkezési adatok
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.fontMuted} />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Category")}
        >
          <Ionicons name="folder-outline" size={20} color={colors.fontMuted} />
          <Text style={[styles.text, { flex: 1, fontSize: 15 }]}>
            Kategóriák
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.fontMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Adatok</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => DrizzleDB.exportMainData()}
        >
          <Ionicons name="download-outline" size={20} color={colors.fontMuted} />
          <Text style={[styles.text, { flex: 1, fontSize: 15 }]}>
            Adatbázis exportálása
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.fontMuted} />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default SettingsPage;
