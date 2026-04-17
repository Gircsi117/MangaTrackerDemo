import MangaPage from "../modules/manga-page.module";
import axios from "axios";
import {
  Chapter,
  ChapterContent,
  ChapterPage,
  ChapterSlug,
  Manga,
  MangaPageConstructor,
} from "../types/manga.type";
import { List, ListParams } from "../types/list.types";
import { v4 as uuidv4 } from "uuid";

class ToonVerseService extends MangaPage {
  public static readonly id = "toonverse";
  public static readonly name = "ToonVerse";
  private static readonly baseUrl = "https://api.toonverse.net/api";
  public static readonly referer = "https://toonverse.net/";
  public static readonly logoUrl = "https://toonverse.net/logo.png";

  private static readonly axios = axios.create({
    baseURL: this.baseUrl,
    headers: {
      Referer: this.referer,
      "User-Agent": this.userAgent,
    },
  });

  get mangaUrl(): string {
    return `${ToonVerseService.referer}series/${this.slug}`;
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const { limit = 20, offset = 0, query } = params;

      const res = await ToonVerseService.axios({
        method: "GET",
        url: `/series`,
        params: {
          search: query,
          limit: limit,
          offset: offset,
          sortBy: "popular",
          timeRange: "all",
          excludeAdult: true,
          includePromotions: true,
          semantic: true,
        },
      });

      const { items, total } = res.data.data;
      const mangas: Manga[] = [];

      for (const item of items) {
        const { id, slug, title, coverUrl, type, author } = item;
        mangas.push({
          id: id,
          slug: slug,
          title: title,
          coverUrl: coverUrl,
          author: author,
          type: type,
          description: "",
        });
      }

      return {
        items: mangas,
        totalCount: total,
      };
    } catch (error) {
      return {
        items: [],
        totalCount: 0,
      };
    }
  }

  public async getManga(): Promise<Manga | null> {
    try {
      if (this.manga) return this.manga;

      const result = await ToonVerseService.axios({
        method: "GET",
        url: `/series/slug/${this.slug}`,
      });

      const data = result.data.data;

      this.manga = {
        id: data.id,
        slug: this.slug,
        title: data.title,
        coverUrl: data.coverUrl,
        author: data.author,
        type: data.type,
        description: data.description,
      } as Manga;

      return this.manga;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getChapters(): Promise<Chapter[]> {
    try {
      if (this.chapters.length) return this.chapters;

      const manga = await this.getManga();
      if (!manga) return [];

      const result = await ToonVerseService.axios({
        method: "GET",
        url: `/series/${manga.id}/chapters`,
        params: {
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0,
          order: "desc",
        },
      });

      const { chapters = [] } = result.data.data;

      const items: Chapter[] = chapters.map(
        (x: any) =>
          ({
            id: x.id,
            number: x.number,
            slug: x.number,
            title: x.title,
            publishedAt: x.publishedAt ? new Date(x.publishedAt) : null,
          }) as Chapter,
      );

      this.chapters = items;
      return items;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getChapterContent(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterContent> {
    try {
      const result = await ToonVerseService.axios({
        method: "GET",
        url: `/reading/chapter/${this.slug}/${chapterSlug}`,
      });

      const { chapter } = result.data.data;
      const { pages = [] } = chapter;

      const withSize: ChapterPage[] = pages
        .map((x: any, i: number) => ({ index: i, ...x }))
        .map((x: any) => {
          const imageUrl = x.imageUrl;

          const result: ChapterPage = {
            id: x.id,
            index: x.index,
            imageUrl,
            width: 2,
            height: 3,
          };

          return result;
        })
        .sort((a: ChapterPage, b: ChapterPage) => a.index - b.index);

      const curr = await this.getRelativeChapter(chapterSlug, +0);
      const next = await this.getRelativeChapter(chapterSlug, +1);
      const prev = await this.getRelativeChapter(chapterSlug, -1);

      return {
        pages: withSize,
        currentChapter: curr,
        nextChapter: next,
        prevChapter: prev,
      };
    } catch (error) {
      console.error(error);

      return {
        pages: [],
        currentChapter: null,
        nextChapter: null,
        prevChapter: null,
      };
    }
  }
}

ToonVerseService satisfies MangaPageConstructor;
export default ToonVerseService;
