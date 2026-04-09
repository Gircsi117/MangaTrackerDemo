import { Chapter, ChapterPage, ChapterSlug, Manga } from "../types/manga.type";

abstract class MangaPage {
  protected slug: string;
  protected manga: Manga | null = null;

  public static userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  constructor(slug: string) {
    this.slug = slug;
  }

  public static async search(): Promise<Manga[]> {
    return [];
  }

  public abstract getManga(): Promise<Manga | null>;
  public abstract getChapters(): Promise<Chapter[]>;
  public abstract getChapterPages(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterPage[]>;
}

export default MangaPage;
