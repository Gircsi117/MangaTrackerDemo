import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles, { colors } from "../styles/styles";
import { Ionicons, MaterialIcons, Fontisto } from "@expo/vector-icons";
import NavbarItem from "./NavbarItem";
import { useNavigationState } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation.type";

const ICON_SIZE = 35;

type Item = {
  to: keyof RootStackParamList;
  icon: React.ReactElement<{ color: string }>;
};

const Navbar = () => {
  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name,
  );

  const items: Item[] = [
    {
      to: "Library",
      icon: <Ionicons name="library" size={ICON_SIZE} />,
    },
    {
      to: "History",
      icon: <Fontisto name="history" size={ICON_SIZE} />,
    },
    {
      to: "Settings",
      icon: <MaterialIcons name="settings" size={ICON_SIZE} />,
    },
  ];

  return (
    <SafeAreaView style={styles.navbar} edges={["bottom"]}>
      <View style={styles.navbarInner}>
        {items.map((x) => (
          <NavbarItem key={x.to} to={x.to}>
            {React.cloneElement(x.icon, {
              color: currentRoute == x.to ? colors.primary : "#fff",
            })}
          </NavbarItem>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Navbar;
