import { Image as RNImage, ImageProps } from "expo-image";
import { useEffect, useState } from "react";
import styles from "../styles/styles";

type Props = ImageProps & {
  defaultAspectRatio?: number;
  autoResize?: boolean;
};

const Image: React.FC<Props> = ({
  defaultAspectRatio = 2 / 3,
  autoResize = false,
  ...props
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspectRatio);

  return (
    <RNImage
      {...props}
      contentFit={props.contentFit || "cover"}
      style={[{ aspectRatio: aspectRatio }, styles.image, props.style]}
      allowDownscaling={props.allowDownscaling || false}
      onLoad={(e) => {
        if (autoResize) {
          const { width, height } = e.source;

          if (width && height) {
            const ratio = width / height;
            if (Math.abs(ratio - aspectRatio) > 0.01) setAspectRatio(ratio);
          }
        }
        props.onLoad?.(e);
      }}
    />
  );
};

export default Image;
