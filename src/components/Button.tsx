import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import styles from "../styles/styles";

type Props = TouchableOpacityProps;

const Button: React.FC<Props> = ({ children, style, ...props }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
