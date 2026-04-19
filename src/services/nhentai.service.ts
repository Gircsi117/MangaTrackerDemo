import axios from "axios";
import MangaPage from "../modules/manga-page.module";
import { ListParams, List } from "../types/list.types";
import {
  Chapter,
  ChapterContent,
  ChapterPage,
  ChapterSlug,
  Manga,
  MangaPageConstructor,
} from "../types/manga.type";
import { parse, HTMLElement } from "node-html-parser";
import { v4 as uuidv4 } from "uuid";

class NHentaiService extends MangaPage {
  public static readonly id: string = "nhentai";
  public static readonly name: string = "NHentai";
  private static readonly baseUrl = "https://nhentai.net";
  public static readonly referer: string = "https://nhentai.net/";
  public static readonly logoUrl: string = "https://nhentai.net/logo.svg";

  private static readonly axios = axios.create({
    baseURL: this.baseUrl,
    headers: {
      Referer: this.referer,
      "User-Agent": this.userAgent,
    },
  });

  public get mangaUrl(): string {
    return `https://nhentai.net/g/${this.slug}`;
  }

  private async getChapterPage(): Promise<HTMLElement | null> {
    try {
      const res = await NHentaiService.axios({
        method: "GET",
        url: `/g/${this.slug}`,
      });

      const root = parse(res.data);

      return root;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const { limit = 20, offset = 0, query } = params;

      const page = offset / limit + 1;

      const res = await this.axios({
        method: "GET",
        url: query ? "/api/v2/search" : "/api/v2/galleries",
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
      if (this.manga) return this.manga;

      const res = await NHentaiService.axios({
        method: "GET",
        url: `/api/v2/galleries/${this.slug}`,
      });

      const data = res.data;
      console.log(data);

      this.manga = {
        id: uuidv4(),
        slug: this.slug,
        title: data.title.english || data.title.japanese || data.title.pretty,
        description: "",
        author: "",
        type: "manga",
        coverUrl: `https://t1.nhentai.net/${data.cover.path}`,
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
      this.chapters = [
        {
          id: uuidv4(),
          slug: "",
          number: 1,
          title: "Pages",
          publishedAt: null,
        },
      ];

      return this.chapters;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getChapterContent(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterContent> {
    try {
      const res = await NHentaiService.axios({
        method: "GET",
        url: `/api/v2/galleries/${this.slug}`,
      });

      const data = res.data;

      console.log(data.pages);

      const pages: ChapterPage[] = data.pages.map(
        (page: any, index: number) => {
          const pageData: ChapterPage = {
            id: uuidv4(),
            index: page.number,
            imageUrl: `https://i${(index % 4) + 1}.nhentai.net/${page.path}`,
            width: page.width,
            height: page.height,
          };

          return pageData;
        },
      );

      console.log("pages", pages);

      return {
        pages: pages,
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
