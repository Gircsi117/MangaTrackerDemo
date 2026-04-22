import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import styles from "../styles/styles";

type Props = TouchableOpacityProps & {
  variant?: "primary" | "ghost";
};

const Button: React.FC<Props> = ({ children, style, variant = "primary", ...props }) => {
  const baseStyle = variant === "ghost" ? styles.buttonGhost : styles.button;
  return (
    <TouchableOpacity style={[baseStyle, style]} {...props}>
      {typeof children === "string" ? (
        <Text style={styles.buttonText}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;
