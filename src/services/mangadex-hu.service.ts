import axios from "axios";
import MangaPage from "../modules/manga-page.module";
import {
  Chapter,
  ChapterContent,
  ChapterPage,
  ChapterSlug,
  Manga,
  MangaPageConstructor,
} from "../types/manga.type";
import { v4 as uuidv4 } from "uuid";
import { List, ListParams } from "../types/list.types";

class MangaDexHuService extends MangaPage {
  public static readonly id: string = "mangadex-hu";
  public static readonly name: string = "MangaDexHU";
  private static readonly baseUrl = "https://api.mangadex.org";
  protected static readonly origin = "https://mangadex.org";
  protected static readonly referer = "https://mangadex.org/";
  public static readonly logoUrl =
    "https://mangadex.org/pwa/icons/icon-192.png";

  private static readonly axios = axios.create({
    baseURL: this.baseUrl,
    headers: this.headers,
  });
  protected lang: string;

  constructor(slug: string) {
    super(slug);
    this.lang = "hu";
  }

  get mangaUrl(): string {
    return `${MangaDexHuService.referer}title/${this.slug}`;
  }

  private getTitle(titles: { [key: string]: string }[]): string {
    try {
      const keys = [
        this.lang,
        "en",
        ...titles.map((x) => Object.keys(x)).flat(),
      ];

      for (const key of keys) {
        const item = titles.find((x) => x[key]);
        if (!item) continue;

        return item[key];
      }

      return "Unknown";
    } catch (error) {
      return "Unknown";
    }
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const { limit = 20, offset = 0, query } = params;

      const result = await MangaDexHuService.axios({
        method: "GET",
        url: "/manga",
        params: {
          title: query,
          limit: limit ?? 20,
          offset: offset ?? 0,
          "includes[]": ["cover_art", "author"],
        },
        signal: params.signal,
      });

      const mangas = result.data.data.map((item: any) => {
        const { id, attributes, relationships } = item;

        const coverArt = relationships.find((r: any) => r.type === "cover_art");
        const fileName = coverArt?.attributes?.fileName;
        const author = relationships.find((r: any) => r.type === "author");

        const result: Manga = {
          id,
          slug: id,
          title: attributes.title?.en || Object.values(attributes.title)[0],
          description: attributes.description?.en || "",
          coverUrl: `https://uploads.mangadex.org/covers/${id}/${fileName}.512.jpg`,
          author: author?.attributes?.name || "Unknown",
          type: attributes.publicationDemographic || "manga",
        };

        return result;
      });

      return {
        items: mangas,
        totalCount: result.data.total,
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

      const result = await MangaDexHuService.axios({
        method: "GET",
        url: `/manga/${this.slug}`,
        params: {
          "includes[]": ["cover_art", "author"],
        },
      });

      const data = result.data.data;
      const { id, attributes, type, relationships } = data;
      const { description, altTitles } = attributes;

      const coverArt = relationships.find((r: any) => r.type === "cover_art");
      const fileName = coverArt?.attributes?.fileName;
      const coverUrl = `https://uploads.mangadex.org/covers/${this.slug}/${fileName}`;

      const author = relationships.find((r: any) => r.type === "author");
      const authorName = author?.attributes?.name;

      this.manga = {
        id: id as string,
        slug: this.slug,
        title: this.getTitle(altTitles),
        description: description["en"],
        coverUrl: coverUrl,
        type: type,
        author: authorName || "Unknown Author",
      };

      return this.manga;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getChapters(): Promise<Chapter[]> {
    try {
      if (this.chapters.length) return this.chapters;

      const result = await MangaDexHuService.axios({
        method: "GET",
        url: `/manga/${this.slug}/feed`,
        params: {
          "translatedLanguage[]": this.lang,
          "order[chapter]": "desc",
        },
      });

      const chapters = result.data.data || [];

      const items: Chapter[] = [];

      for (const item of chapters) {
        const { id, attributes } = item;
        const { publishAt, chapter, title } = attributes;

        items.push({
          id: id,
          slug: id,
          title: title || `Chapter ${chapter}`,
          number: Number(chapter),
          publishedAt: publishAt ? new Date(publishAt) : null,
        });
      }

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
      const serverResult = await MangaDexHuService.axios.get(
        `/at-home/server/${chapterSlug}`,
      );

      const data = serverResult.data;
      const { baseUrl, chapter } = data;

      const pages: ChapterPage[] = chapter.data.map(
        (filename: string, index: number) => {
          const page: ChapterPage = {
            id: uuidv4(),
            index: index,
            imageUrl: `${baseUrl}/data/${chapter.hash}/${filename}`,
            width: 2,
            height: 3,
          };

          return page;
        },
      );

      const curr = await this.getRelativeChapter(chapterSlug, +0);
      const next = await this.getRelativeChapter(chapterSlug, +1);
      const prev = await this.getRelativeChapter(chapterSlug, -1);

      return {
        pages,
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

MangaDexHuService satisfies MangaPageConstructor;
export default MangaDexHuService;
