import { ImageLoadEventData } from "expo-image";
import { ChapterPage, MangaPageConstructor } from "../types/manga.type";
import React from "react";
import Image from "./Image";

type PageImageProps = {
  page: ChapterPage;
  index: number;
  service: MangaPageConstructor;
  onTouchEnd: () => void;
  onLoad: (e: ImageLoadEventData) => void;
};

const PageImage = React.memo<PageImageProps>(
  ({ page, index, service, onTouchEnd, onLoad }) => (
    <Image
      transition={200}
      recyclingKey={page.id}
      source={{ uri: page.imageUrl, headers: service.headers }}
      style={{ aspectRatio: page.width / page.height }}
      priority={index < 3 ? "high" : "normal"}
      onLoad={onLoad}
      onTouchEnd={onTouchEnd}
    />
  ),
);

export default PageImage;
