import axios from "axios";
import MangaPage from "../modules/manga-page.module";
import {
  Chapter,
  ChapterPage,
  ChapterSlug,
  Manga,
  MangaPageConstructor,
} from "../types/manga.type";
import { v4 as uuidv4 } from "uuid";
import { List, ListParams } from "../types/list.types";

class MangaDexService extends MangaPage {
  public static readonly id = "mangadex";
  public static readonly name = "MangaDex_HU";
  private static readonly baseUrl = "https://api.mangadex.org";
  public static readonly referer = "https://mangadex.org/";
  public static readonly logoUrl =
    "https://mangadex.org/pwa/icons/icon-192.png";

  private static readonly axios = axios.create({
    baseURL: this.baseUrl,
    headers: {
      Referer: this.referer,
      "User-Agent": this.userAgent,
    },
  });
  private readonly lang: string;

  constructor(slug: string) {
    super(slug);
    this.lang = "hu";
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

      const result = await MangaDexService.axios({
        method: "GET",
        url: "/manga",
        params: {
          title: params.query,
          limit: params.limit ?? 20,
          offset: params.offset ?? 0,
          "includes[]": ["cover_art", "author"],
        },
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
      const result = await MangaDexService.axios({
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

      const manga: Manga = {
        id: id as string,
        slug: this.slug,
        title: this.getTitle(altTitles),
        description: description["en"],
        coverUrl: coverUrl,
        type: type,
        author: authorName || "Unknown Author",
      };

      return manga;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getChapters(): Promise<Chapter[]> {
    try {
      const result = await MangaDexService.axios({
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

      return items;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getChapterPages(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterPage[]> {
    try {
      const result = await MangaDexService.axios({
        method: "GET",
        url: `/at-home/server/${chapterSlug}`,
      });

      const data = result.data;
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

      return pages;
    } catch (error) {
      console.error(error);

      return [];
    }
  }
}

MangaDexService satisfies MangaPageConstructor;
export default MangaDexService;
