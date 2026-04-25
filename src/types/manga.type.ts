import MangaService from "../services/manga.service";
import { List, ListParams } from "./list.types";

export type MangaPageConstructor = {
  new (slug: string): MangaService;
  readonly id: string;
  readonly name: string;
  readonly logoUrl: string;
  readonly headers: typeof MangaService.headers;
  readonly needLogin: boolean;
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
