export type Manga = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  author: string;
  description: string;
  type: string;
};

export type ChapterSlug = string | number;

export type Chapter = {
  id: string;
  slug: ChapterSlug;
  number: number;
  title: string;
  publishedAt: Date | null;
};

export type ChapterPage = {
  id: string;
  index: number;
  imageUrl: string;
  width: number;
  height: number;
};
