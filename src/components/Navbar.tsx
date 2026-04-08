import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/style";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation.types";
import { useNavigation } from "@react-navigation/native";

type NavbarNavigation = NativeStackNavigationProp<RootStackParamList>;

const Navbar = () => {
  const navigation = useNavigation<NavbarNavigation>();

  return (
    <SafeAreaView style={styles.navbar} edges={["bottom"]}>
      <View style={styles.navbarInner}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.text}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Details", { name: "Erik" })}
        >
          <Text style={styles.text}>Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Navbar;
