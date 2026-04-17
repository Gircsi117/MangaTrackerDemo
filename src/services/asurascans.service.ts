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
import { parse } from "node-html-parser";
import { List, ListParams } from "../types/list.types";

class AsuraScansService extends MangaPage {
  public static readonly id = "asurascans";
  public static readonly name = "AsuraScans";
  private static readonly baseUrl = "https://asurascans.com";
  public static readonly referer = "https://asurascans.com/";
  public static readonly logoUrl = "https://asurascans.com/images/logo.webp";

  private static readonly axios = axios.create({
    baseURL: this.baseUrl,
    headers: {
      Referer: this.referer,
      "User-Agent": this.userAgent,
    },
  });

  get mangaUrl(): string {
    return `${AsuraScansService.referer}comics/${this.slug}`;
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const { limit = 20, offset = 0, query } = params;

      const page = offset / limit + 1;

      const res = await AsuraScansService.axios({
        method: "GET",
        url: `/browse`,
        params: { q: query, page: page },
      });

      const root = parse(res.data);
      const propsRaw = root
        .querySelector("astro-island[props*='initialSeries']")
        ?.getAttribute("props");

      if (!propsRaw) return { items: [], totalCount: 0 };

      const props = JSON.parse(propsRaw);
      const totalCount = props.totalCount?.[1] ?? 0;
      const series = props.initialSeries?.[1] ?? [];

      const items = series.map((item: any) => {
        const s = item[1];
        const manga: Manga = {
          id: String(s.id[1]),
          slug: s.slug[1],
          title: s.title[1],
          coverUrl: s.cover[1],
          author: s.author?.[1] || "Unknown",
          description: s.description?.[1] || "",
          type: s.type[1],
        };

        return manga;
      });

      return {
        items: items,
        totalCount: totalCount,
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

      const res = await AsuraScansService.axios.get(`/comics/${this.slug}`);
      const root = parse(res.data);

      const propsRaw = root
        .querySelector("astro-island[props*='title']")
        ?.getAttribute("props");

      if (!propsRaw) return null;

      const props = JSON.parse(propsRaw);

      this.manga = {
        id: this.slug,
        slug: this.slug,
        title: props.title[1],
        description: props.description[1],
        author: props.author[1],
        coverUrl: props.coverUrl[1],
        type: props.type[1],
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

      const res = await AsuraScansService.axios.get(`/comics/${this.slug}`);
      const root = parse(res.data);

      const propsRaw = root
        .querySelector("astro-island[props*='chapters']")
        ?.getAttribute("props");

      if (!propsRaw) return [];

      const props = JSON.parse(propsRaw);

      const chapters: Chapter[] = props.chapters[1].map((chapter: any) => ({
        id: String(chapter[1].id[1]),
        slug: String(chapter[1].number[1]),
        title: chapter?.[1].title?.[1] || `Chapter ${chapter[1].number[1]}`,
        number: Number(chapter[1].number[1]),
        publishedAt: chapter?.[1].published_at?.[1]
          ? new Date(chapter?.[1].published_at?.[1])
          : null,
      }));

      this.chapters = chapters;
      return chapters;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getChapterContent(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterContent> {
    try {
      const res = await AsuraScansService.axios.get(
        `/comics/${this.slug}/chapter/${chapterSlug}`,
      );
      const root = parse(res.data);

      const propsRaw = root
        .querySelector("astro-island[props*='pages']")
        ?.getAttribute("props");

      if (!propsRaw)
        return {
          pages: [],
          currentChapter: null,
          nextChapter: null,
          prevChapter: null,
        };

      const props = JSON.parse(propsRaw);

      const pages: ChapterPage[] = props.pages[1].map(
        (page: any, index: number) => {
          const chapterPage: ChapterPage = {
            id: String(index),
            index,
            imageUrl: page[1].url?.[1] ?? "",
            width: page[1]?.width?.[1] ?? 2,
            height: page[1]?.height?.[1] ?? 3,
          };

          return chapterPage;
        },
      );

      const curr = await this.getRelativeChapter(chapterSlug, +0);
      const next = await this.getRelativeChapter(chapterSlug, +1);
      const prev = await this.getRelativeChapter(chapterSlug, -1);

      return {
        pages: pages,
        currentChapter: curr,
        nextChapter: next,
        prevChapter: next,
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

AsuraScansService satisfies MangaPageConstructor;
export default AsuraScansService;
