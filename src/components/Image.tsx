import { Image as RNImage, ImageProps } from "expo-image";
import styles from "../styles/styles";

type Props = ImageProps;

const Image: React.FC<Props> = ({ ...props }) => {
  return (
    <RNImage
      {...props}
      contentFit={props.contentFit || "contain"}
      style={[styles.image, props.style]}
      allowDownscaling={props.allowDownscaling ?? false}
    />
  );
};

export default Image;
