import { Image as RNImage, ImageProps } from "expo-image";
import { useEffect, useState } from "react";

type Props = ImageProps & {
  defaultAspectRatio?: number;
  autoResize?: boolean;
};

const Image: React.FC<Props> = ({
  defaultAspectRatio,
  autoResize = false,
  ...props
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(
    defaultAspectRatio || 2 / 3,
  );

  return (
    <RNImage
      {...props}
      contentFit={props.contentFit || "fill"}
      style={[props.style, { aspectRatio: aspectRatio, flex: 1 }]}
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
