import MangaPage from "../modules/manga-page.module";
import { List, ListParams } from "./list.types";

export type MangaPageConstructor = {
  new (slug: string): MangaPage;
  readonly id: string;
  readonly name: string;
  readonly userAgent: string;
  readonly referer: string;
  readonly logoUrl: string;
  search(params?: ListParams): Promise<List<Manga>>;
};

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

export type ChapterContent = {
  pages: ChapterPage[];
  currentChapter: Chapter | null;
  nextChapter: Chapter | null;
  prevChapter: Chapter | null;
};
