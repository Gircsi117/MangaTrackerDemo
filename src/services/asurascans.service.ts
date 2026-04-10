import axios from "axios";
import MangaPage from "../modules/manga-page.module";
import {
  Chapter,
  ChapterPage,
  ChapterSlug,
  List,
  ListParams,
  Manga,
  MangaPageConstructor,
} from "../types/manga.type";
import { parse } from "node-html-parser";

class AsuraScansService extends MangaPage {
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

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const { limit = 20, offset = 0, query } = params;

      const res = await axios({
        method: "get",
        url: "https://api.asurascans.com/api/search",
        params: {
          q: query,
          limit: limit,
          offset: offset,
        },
        headers: {
          Referer: this.referer,
          Origin: this.referer,
          "User-Agent": this.userAgent,
        },
      });

      const { data, meta } = res.data;
      if (!data) return { items: [], totalCount: 0 };

      const result = data.map((item: any) => {
        const { id, slug, title, cover, description, type, author } = item;
        const manga: Manga = {
          id: id,
          slug: slug,
          title: title,
          coverUrl: cover,
          author: author,
          type: type,
          description: description,
        };

        return manga;
      });

      return {
        items: result,
        totalCount: meta.total,
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
      const res = await AsuraScansService.axios.get(`/comics/${this.slug}`);
      const root = parse(res.data);

      const propsRaw = root
        .querySelector("astro-island[props*='title']")
        ?.getAttribute("props");

      if (!propsRaw) return null;

      const props = JSON.parse(propsRaw);

      const manga: Manga = {
        id: this.slug,
        slug: this.slug,
        title: props.title[1],
        description: props.description[1],
        author: props.author[1],
        coverUrl: props.coverUrl[1],
        type: props.type[1],
      };

      return manga;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getChapters(): Promise<Chapter[]> {
    try {
      const res = await AsuraScansService.axios.get(`/comics/${this.slug}`);
      const root = parse(res.data);

      const propsRaw = root
        .querySelector("astro-island[props*='chapters']")
        ?.getAttribute("props");

      if (!propsRaw) return [];

      const props = JSON.parse(propsRaw);

      return props.chapters[1].map((chapter: any) => ({
        id: String(chapter[1].id[1]),
        slug: String(chapter[1].number[1]),
        title: chapter?.[1].title?.[1] || `Chapter ${chapter[1].number[1]}`,
        number: Number(chapter[1].number[1]),
        publishedAt: chapter?.[1].published_at?.[1]
          ? new Date(chapter?.[1].published_at?.[1])
          : null,
      })) as Chapter[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getChapterPages(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterPage[]> {
    try {
      const res = await AsuraScansService.axios.get(
        `/comics/${this.slug}/chapter/${chapterSlug}`,
      );
      const root = parse(res.data);

      const propsRaw = root
        .querySelector("astro-island[props*='pages']")
        ?.getAttribute("props");

      if (!propsRaw) return [];

      const props = JSON.parse(propsRaw);

      return props.pages[1].map((page: any, index: number) => ({
        id: String(index),
        index,
        imageUrl: page[1].url[1],
        width: page[1].width[1],
        height: page[1].height[1],
      })) as ChapterPage[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

AsuraScansService satisfies MangaPageConstructor;
export default AsuraScansService;
