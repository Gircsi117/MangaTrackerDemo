import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/style";

const Navbar = () => {
  return (
    <SafeAreaView style={styles.navbar} edges={["bottom"]}>
      <Text style={styles.text}>Navbar</Text>
    </SafeAreaView>
  );
};

export default Navbar;
