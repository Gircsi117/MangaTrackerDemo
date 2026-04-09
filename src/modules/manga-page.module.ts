import { Chapter, ChapterPage, ChapterSlug, Manga } from "../types/manga.type";

abstract class MangaPage {
  protected slug: string;
  protected manga: Manga | null = null;

  constructor(slug: string) {
    this.slug = slug;
  }

  public static async search(): Promise<Manga[]> {
    return [];
  }

  public abstract getManga(): Promise<Manga | null>;
  public abstract getChapters(): Promise<Chapter[]>;
  public abstract getChapterPages(slug: ChapterSlug): Promise<ChapterPage[]>;
}

export default MangaPage;
