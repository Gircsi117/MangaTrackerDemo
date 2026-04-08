import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";
import Navbar from "./Navbar";

type ContainerProps = {
  children: React.ReactNode;
  withNavbar?: boolean;
};

const Container: React.FC<ContainerProps> = ({
  children,
  withNavbar = false,
}) => {
  return (
    <SafeAreaView
      style={styles.container}
      edges={withNavbar ? ["top"] : undefined}
    >
      <ScrollView style={styles.scroll}>{children}</ScrollView>
      {withNavbar && <Navbar />}
    </SafeAreaView>
  );
};

export default Container;
