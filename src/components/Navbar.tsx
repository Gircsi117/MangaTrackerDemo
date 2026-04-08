import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation.types";
import { useNavigation } from "@react-navigation/native";

import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

type NavbarNavigation = NativeStackNavigationProp<RootStackParamList>;

const Navbar = () => {
  const navigation = useNavigation<NavbarNavigation>();

  return (
    <SafeAreaView style={styles.navbar} edges={["bottom"]}>
      <View style={styles.navbarInner}>
        <TouchableOpacity
          style={styles.navbarItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={35} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navbarItem}
          onPress={() =>
            navigation.navigate("Details", {
              name: "e9c9ef6e-59db-42fe-9bdc-ee189e0f0c5f",
            })
          }
        >
          <MaterialIcons name="details" size={35} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Navbar;
