import axios from "axios";
import MangaPage from "../modules/manga-page.module";
import { List, ListParams } from "../types/list.types";
import {
  Chapter,
  ChapterContent,
  ChapterPage,
  ChapterSlug,
  Manga,
  MangaPageConstructor,
} from "../types/manga.type";
import useCredentialsStore from "../stores/credentials.store";
import { v4 as uuidv4 } from "uuid";

class PadlizsanFanSubService extends MangaPage {
  public static readonly id = "padlizsanfansub";
  public static readonly name = "PadlizsanFanSub";
  private static readonly baseUrl = "https://padlizsanfansub.hu";
  public static readonly referer = "https://padlizsanfansub.hu/";
  public static readonly logoUrl = "https://padlizsanfansub.hu/assets/logo.png";

  private static readonly axios = (() => {
    const instance = axios.create({
      baseURL: PadlizsanFanSubService.baseUrl + "/api",
      headers: {
        Referer: PadlizsanFanSubService.referer,
        Origin: PadlizsanFanSubService.referer,
        "User-Agent": MangaPage.userAgent,
      },
      withCredentials: true,
    });

    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          await PadlizsanFanSubService.login();
          return instance(error.config);
        }
        return Promise.reject(error);
      },
    );

    return instance;
  })();

  get mangaUrl(): string {
    return `${PadlizsanFanSubService.referer}chapters.html?slug=${this.slug}`;
  }

  private static setUrl(url: string) {
    if (url.startsWith("http")) return url;
    return `${PadlizsanFanSubService.baseUrl}${url}`;
  }

  private static async login() {
    const { get } = useCredentialsStore.getState();
    const credentials = get(this.id);

    if (!credentials) return;

    const instance = axios.create({
      baseURL: PadlizsanFanSubService.baseUrl + "/api",
      headers: {
        Referer: PadlizsanFanSubService.referer,
        Origin: PadlizsanFanSubService.referer,
        "User-Agent": MangaPage.userAgent,
      },
      withCredentials: true,
    });

    const res = await instance({
      method: "POST",
      url: "/auth/login",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        login: credentials.email,
        password: credentials.password,
        remember: true,
      }),
    });

    if (!res.data.ok)
      throw new Error(res.data.error || "Authentication failed");
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const { limit = 20, offset = 0, query = "" } = params;

      const res = await this.axios({
        method: "GET",
        url: `/manga`,
        params: {
          search: query,
          limit: limit,
          offset: offset,
        },
      });

      const list: any[] = res.data;

      const mangas = list.map((item) => {
        const manga: Manga = {
          id: uuidv4(),
          slug: item.slug,
          title: item.title,
          coverUrl: PadlizsanFanSubService.setUrl(item.cover_url),
          author: "",
          type: "",
          description: "",
        };

        return manga;
      });

      const searched = mangas.filter((manga) =>
        manga.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      );

      const result = searched.slice(offset, offset + limit);

      return {
        items: result,
        totalCount: searched.length,
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

      const res = await PadlizsanFanSubService.axios({
        method: "GET",
        url: `/manga/${this.slug}`,
      });

      const data = res.data;

      this.manga = {
        id: uuidv4(),
        slug: data.slug,
        title: data.title,
        coverUrl: PadlizsanFanSubService.setUrl(data.cover_url),
        author: "",
        type: "",
        description: (data.description || "").replace(/<br>/g, "\n"),
      };

      return this.manga;
    } catch (error) {
      return null;
    }
  }

  public async getChapters(): Promise<Chapter[]> {
    try {
      if (this.chapters.length) return this.chapters;

      const res = await PadlizsanFanSubService.axios.get(
        `/chapters/${this.slug}`,
      );

      const data: any[] = res.data.chapters;

      const chapters = data
        .filter((item) => !item.locked)
        .map((item, index) => {
          const chapter: Chapter = {
            id: uuidv4(),
            slug: item.folder,
            title: item.title,
            number: index + 1,
            publishedAt: new Date(item.scanned_at),
          };

          return chapter;
        });

      this.chapters = chapters.reverse();
      return this.chapters;
    } catch (error) {
      return [];
    }
  }

  public async getChapterContent(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterContent> {
    try {
      const res = await PadlizsanFanSubService.axios.get(
        `/pages/${this.slug}/${chapterSlug}`,
      );

      const data: string[] = res.data.pages;
      const folder = res.data.library;

      const pages = data.map((item, index) => {
        const page: ChapterPage = {
          id: uuidv4(),
          index: index,
          imageUrl: `${PadlizsanFanSubService.baseUrl}/api/image/${folder}/${this.slug}/${chapterSlug}/${item}`,
          width: 2,
          height: 3,
        };

        return page;
      });

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
      return {
        pages: [],
        currentChapter: null,
        nextChapter: null,
        prevChapter: null,
      };
    }
  }
}

PadlizsanFanSubService satisfies MangaPageConstructor;
export default PadlizsanFanSubService;
