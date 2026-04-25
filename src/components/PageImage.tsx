import { ImageLoadEventData } from "expo-image";
import { ChapterPage, MangaPageConstructor } from "../types/manga.type";
import React, { useCallback } from "react";
import Image from "./Image";
import { Dimensions } from "react-native";

type PageImageProps = {
  page: ChapterPage;
  index: number;
  service: MangaPageConstructor;
  onTouchEnd: () => void;
  onSizeLoad: (id: string, width: number, height: number) => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const PageImage = React.memo<PageImageProps>(
  ({ page, index, service, onTouchEnd, onSizeLoad }) => {
    const handleLoad = useCallback(
      (e: ImageLoadEventData) => {
        onSizeLoad(page.id, e.source.width, e.source.height);
      },
      [page.id, onSizeLoad],
    );

    const aspectRatio =
      page.width && page.height && page.width > 0 && page.height > 0
        ? page.width / page.height
        : 2 / 3;

    console.log("PageImage render", {
      id: page.id,
      pageWidth: page.width,
      pageHeight: page.height,
      aspectRatio,
      sourceWidth: SCREEN_WIDTH,
      sourceHeight: SCREEN_WIDTH / aspectRatio,
    });

    return (
      <Image
        transition={200}
        recyclingKey={page.id}
        source={{
          uri: page.imageUrl,
          headers: service.headers,
        }}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH / aspectRatio,
        }}
        priority={index < 3 ? "high" : "normal"}
        responsivePolicy="initial"
        onLoad={handleLoad}
        onTouchEnd={onTouchEnd}
      />
    );
  },
);

export default PageImage;
