import { ImageLoadEventData } from "expo-image";
import { ChapterPage, MangaPageConstructor } from "../types/manga.type";
import React, { useCallback } from "react";
import Image from "./Image";

type PageImageProps = {
  page: ChapterPage;
  index: number;
  service: MangaPageConstructor;
  onTouchEnd: () => void;
  onSizeLoad: (id: string, width: number, height: number) => void;
};

const PageImage = React.memo<PageImageProps>(
  ({ page, index, service, onTouchEnd, onSizeLoad }) => {
    const handleLoad = useCallback(
      (e: ImageLoadEventData) => {
        onSizeLoad(page.id, e.source.width, e.source.height);
      },
      [page.id, onSizeLoad],
    );

    return (
      <Image
        transition={200}
        recyclingKey={page.id}
        source={{ uri: page.imageUrl, headers: service.headers }}
        style={{ aspectRatio: page.width / page.height }}
        priority={index < 3 ? "high" : "normal"}
        onLoad={handleLoad}
        onTouchEnd={onTouchEnd}
      />
    );
  },
);

export default PageImage;
