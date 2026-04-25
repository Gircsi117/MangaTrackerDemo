import React from "react";
import { ScrollView } from "react-native";
import { Edges, SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";
import Navbar from "./Navbar";

type ContainerProps = {
  children: React.ReactNode;
  withNavbar?: boolean;
  noSroll?: boolean;
  scrollRef?: React.RefObject<ScrollView | null>;
  edges?: Edges;
};

const Container: React.FC<ContainerProps> = ({
  children,
  withNavbar = false,
  noSroll = false,
  scrollRef,
  edges,
}) => {
  return (
    <>
      <SafeAreaView
        style={styles.container}
        edges={edges ? edges : withNavbar ? ["top"] : undefined}
      >
        {noSroll ? (
          children
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} ref={scrollRef}>
            {children}
          </ScrollView>
        )}
        {withNavbar && <Navbar />}
      </SafeAreaView>
    </>
  );
};

export default Container;
