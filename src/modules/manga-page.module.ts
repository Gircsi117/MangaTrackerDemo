import { List, ListParams } from "../types/list.types";
import {
  Chapter,
  ChapterPage,
  ChapterSlug,
  Manga,
} from "../types/manga.type";

abstract class MangaPage {
  public static readonly logoUrl: string = "";

  protected slug: string;
  protected manga: Manga | null = null;

  public static readonly userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  constructor(slug: string) {
    this.slug = slug;
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    return {
      items: [],
      totalCount: 0,
    };
  }

  public abstract getManga(): Promise<Manga | null>;
  public abstract getChapters(): Promise<Chapter[]>;
  public abstract getChapterPages(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterPage[]>;
}

export default MangaPage;
