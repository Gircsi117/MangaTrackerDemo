import React from "react";
import { RootStackParamList } from "../types/navigation.type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import styles from "../styles/styles";

type NavbarNavigation = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  to: keyof RootStackParamList;
  params?: RootStackParamList[keyof RootStackParamList];
  children: React.ReactNode;
};

const NavbarItem: React.FC<Props> = ({ children, to, params }) => {
  const navigation = useNavigation<NavbarNavigation>();

  return (
    <TouchableOpacity
      style={[styles.navbarItem]}
      onPress={() => navigation.navigate(to, params as any)}
    >
      {children}
    </TouchableOpacity>
  );
};

export default NavbarItem;
