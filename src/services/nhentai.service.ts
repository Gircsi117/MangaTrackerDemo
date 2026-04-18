import axios from "axios";
import MangaPage from "../modules/manga-page.module";
import { ListParams, List } from "../types/list.types";
import {
  Chapter,
  ChapterContent,
  Manga,
  MangaPageConstructor,
} from "../types/manga.type";

class NHentaiService extends MangaPage {
  public static readonly id: string = "nhentai";
  public static readonly name: string = "NHentai";
  private static readonly baseUrl = "https://nhentai.net";
  public static readonly referer: string = "https://nhentai.net/";
  public static readonly logoUrl: string = "https://nhentai.net/logo.svg";

  private static readonly axios = axios.create({
    baseURL: this.baseUrl + "/api/v2",
    headers: {
      Referer: this.referer,
      "User-Agent": this.userAgent,
    },
  });

  public get mangaUrl(): string {
    return `https://nhentai.net/g/${this.slug}`;
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const { limit = 20, offset = 0, query } = params;

      const page = offset / limit + 1;

      const res = await this.axios({
        method: "GET",
        url: query ? "/search" : "/galleries",
        params: {
          query,
          page: page,
          sort: "date",
        },
      });

      const { result = [], total = 0, num_pages = 0, per_page = 0 } = res.data;

      const mangas: Manga[] = result.map((item: any) => {
        const manga: Manga = {
          id: item.id,
          slug: item.id,
          title: item.english_title || item.japanese_title,
          description: "",
          author: "",
          type: "manga",
          coverUrl: `https://t1.nhentai.net/${item.thumbnail}`,
        };

        return manga;
      });

      return {
        items: mangas,
        totalCount: total || num_pages * per_page,
      };
    } catch (error) {
      console.error(error);
      return {
        items: [],
        totalCount: 0,
      };
    }
  }

  public async getManga(): Promise<Manga | null> {
    try {
      return this.manga;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getChapters(): Promise<Chapter[]> {
    try {
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getChapterContent(): Promise<ChapterContent> {
    try {
      return {
        pages: [],
        currentChapter: null,
        nextChapter: null,
        prevChapter: null,
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

NHentaiService satisfies MangaPageConstructor;
export default NHentaiService;
