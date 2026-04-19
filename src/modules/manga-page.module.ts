import { List, ListParams } from "../types/list.types";
import {
  Chapter,
  ChapterContent,
  ChapterPage,
  ChapterSlug,
  Manga,
} from "../types/manga.type";

abstract class MangaPage {
  public static readonly logoUrl: string = "";

  protected slug: string;
  protected manga: Manga | null = null;
  protected chapters: Chapter[] = [];

  abstract get mangaUrl(): string;

  protected static readonly origin: string;
  protected static readonly referer: string;
  private static readonly userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  public static get headers() {
    return {
      Origin: this.origin,
      Referer: this.referer,
      "User-Agent": this.userAgent,
    };
  }

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

  public abstract getChapterContent(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterContent>;

  protected async getRelativeChapter(
    chapterSlug: ChapterSlug,
    offset: number,
  ): Promise<Chapter | null> {
    try {
      const chapters = await this.getChapters();
      const sortedChapters = chapters.sort((a, b) => a.number - b.number);
      const index =
        sortedChapters.findIndex((x) => x.slug === chapterSlug) + offset;
      return sortedChapters[index] || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default MangaPage;
