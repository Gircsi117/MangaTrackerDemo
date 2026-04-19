import React from "react";
import { ChapterPage, MangaPageConstructor } from "../types/manga.type";
import Image from "./Image";

type Props = {
  page: ChapterPage;
  index: number;
  service: MangaPageConstructor;
  onTouchEnd: () => void;
};

const PageImage: React.FC<Props> = React.memo(
  ({ page, index, service, onTouchEnd }) => {
    return (
      <Image
        autoResize
        transition={200}
        recyclingKey={page.id}
        defaultAspectRatio={page.width / page.height}
        priority={index < 3 ? "high" : "normal"}
        allowDownscaling={index >= 3}
        onTouchEnd={onTouchEnd}
        source={{
          uri: page.imageUrl,
          headers: {
            Referer: service.referer,
            "User-Agent": service.userAgent,
          },
        }}
      />
    );
  },
);

export default PageImage;
