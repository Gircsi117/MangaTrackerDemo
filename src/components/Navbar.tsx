import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import NavbarItem from "./NavbarItem";

const Navbar = () => {
  return (
    <SafeAreaView style={styles.navbar} edges={["bottom"]}>
      <View style={styles.navbarInner}>
        <NavbarItem to="Home">
          <Ionicons name="home" size={35} color="#fff" />
        </NavbarItem>

        <NavbarItem to="Details" params={{ name: "Alma" }}>
          <MaterialIcons name="details" size={35} color="#fff" />
        </NavbarItem>
      </View>
    </SafeAreaView>
  );
};

export default Navbar;
