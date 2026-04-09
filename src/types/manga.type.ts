import MangaPage from "../modules/manga-page.module";

export type List<T = any> = {
  items: T[];
  totalCount: number;
};

export type MangaPageConstructor = {
  new (slug: string): MangaPage;
  readonly name: string;
  readonly userAgent: string;
  readonly referer: string;
  readonly logoUrl: string;
  search(params?: ListParams): Promise<List<Manga>>;
};

export type ListParams = {
  limit?: number;
  offset?: number;
  order?: "asc" | "desc";
  query?: string;
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
