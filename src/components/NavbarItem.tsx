import React from "react";
import { RootStackParamList } from "../types/navigation.type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";
import styles, { colors } from "../styles/styles";

type NavbarNavigation = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  to: keyof RootStackParamList;
  params?: RootStackParamList[keyof RootStackParamList];
  icon: React.ReactElement<{ color: string }>;
  title: string;
};

const NavbarItem: React.FC<Props> = ({ icon, title, to, params }) => {
  const navigation = useNavigation<NavbarNavigation>();
  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name,
  );

  return (
    <TouchableOpacity
      style={[styles.navbarItem]}
      onPress={() => navigation.navigate(to, params as any)}
    >
      {React.cloneElement(icon, {
        color: currentRoute == to ? colors.primary : "#fff",
      })}
      <Text
        style={[
          styles.navbarItemText,
          { color: currentRoute == to ? colors.primary : "#fff" },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default NavbarItem;
