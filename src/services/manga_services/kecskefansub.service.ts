import axios from "axios";
import { ListParams, List } from "../../types/list.types";
import {
  Chapter,
  ChapterContent,
  ChapterPage,
  ChapterSlug,
  Manga,
  MangaPageConstructor,
} from "../../types/manga.type";
import parse from "node-html-parser";
import { v4 as uuidv4 } from "uuid";
import useCredentialsStore from "../../stores/credentials.store";
import MangaService from "../manga.service";

class KecskeFanSubService extends MangaService {
  static id = "kecskefansub";
  static name = "KecskeFanSub";
  protected static readonly origin = "https://www.kecskefansub.com";
  protected static readonly referer = "https://www.kecskefansub.com/";
  public static readonly logoUrl =
    "https://www.kecskefansub.com/images/menu/logo.png";
  public static needLogin: boolean = true;

  private static readonly axios = (() => {
    const instance = axios.create({
      baseURL: KecskeFanSubService.origin,
      headers: this.headers,
      withCredentials: true,
    });

    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          await KecskeFanSubService.login();
          return instance(error.config);
        }
        return Promise.reject(error);
      },
    );

    return instance;
  })();

  public get mangaUrl() {
    return `${KecskeFanSubService.origin}/series/${this.slug}`;
  }

  private static async login() {
    const { get } = useCredentialsStore.getState();
    const credentials = get(this.id);

    if (!credentials) throw new Error("Missing credentials!");

    const instance = axios.create({
      baseURL: KecskeFanSubService.origin,
      headers: this.headers,
      withCredentials: true,
    });

    const formData = new FormData();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);
    formData.append("remember_me", "1");

    const res = await instance({
      method: "POST",
      url: "/index.php/api/login",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const res = await this.axios({ method: "GET", url: "" });

      const root = parse(res.data, {
        comment: false,
        blockTextElements: { script: true, noscript: true, style: true },
      });

      const links = root.querySelectorAll(".card-link-wrapper");

      const mangas = links
        .map((link) => {
          const slug = link.getAttribute("href")?.split("/").pop() || "";
          const img = link.querySelector(".card-main-image");

          const coverUrl = `${this.origin}${img?.getAttribute("src")}`;
          const title = img?.getAttribute("alt");

          const manga: Manga = {
            id: slug || uuidv4(),
            slug: slug,
            title: title || "Unknown",
            coverUrl: coverUrl,
            author: "Unknown",
            type: "Unknown",
            description: "",
          };

          return manga;
        })
        .filter((x) => x.slug);

      return {
        items: mangas,
        totalCount: mangas.length,
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

      const res = await KecskeFanSubService.axios({
        method: "GET",
        url: `/series/${this.slug}`,
      });

      const root = parse(res.data, {
        comment: false,
        blockTextElements: { script: true, noscript: true, style: true },
      });

      const dataDiv = root.querySelector(".main-content-frame");
      const img = dataDiv?.querySelector(".series-main-image");

      const coverUrl = `${KecskeFanSubService.origin}${img?.getAttribute("src")}`;
      const title = img?.getAttribute("alt");

      const description = dataDiv
        ?.querySelector(".series-description-box")
        ?.querySelector("p")?.innerText;

      const type = dataDiv
        ?.querySelectorAll(".info-box")
        .find((x) => x.innerText.startsWith("Típus:"))
        ?.innerText.split(" ")
        .pop();

      this.manga = {
        id: this.slug,
        slug: this.slug,
        title: title || "",
        description: description || "",
        author: "Unknown",
        type: type || "",
        coverUrl: coverUrl || "",
      };

      return this.manga;
    } catch (error) {
      return null;
    }
  }

  public async getChapters(): Promise<Chapter[]> {
    try {
      if (this.chapters.length) return this.chapters;

      const res = await KecskeFanSubService.axios({
        method: "GET",
        url: `/series/${this.slug}`,
      });

      const root = parse(res.data, {
        comment: false,
        blockTextElements: { script: true, noscript: true, style: true },
      });

      const chapterItems = root
        .querySelectorAll(".series-chapter-item")
        .filter((image) => !image.classList.contains("locked-item"));

      this.chapters = chapterItems.map((item) => {
        const chapterSlug = item.getAttribute("data-chapter");
        const title = item
          .querySelector(".series-chapter-number")
          ?.innerText.trim();

        const chapter: Chapter = {
          id: chapterSlug || uuidv4(),
          slug: chapterSlug || "",
          number: Number(chapterSlug),
          title: title || "",
          publishedAt: null,
        };

        return chapter;
      });

      return this.chapters;
    } catch (error) {
      return [];
    }
  }

  public async getChapterContent(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterContent> {
    try {
      const res = await KecskeFanSubService.axios({
        method: "GET",
        url: `/read/${this.slug}/${chapterSlug}`,
      });

      const root = parse(res.data, {
        comment: false,
        blockTextElements: { script: true, noscript: true, style: true },
      });

      const images = root.querySelectorAll(".reader-image");

      const pages = images.map((img, index) => {
        const url = img.getAttribute("src");

        const page: ChapterPage = {
          id: uuidv4(),
          index: index,
          imageUrl: `${KecskeFanSubService.origin}/${url}`,
          width: 2,
          height: 3,
        };

        return page;
      });

      const curr = await this.getRelativeChapter(chapterSlug, +0);
      const next = await this.getRelativeChapter(chapterSlug, +1);
      const prev = await this.getRelativeChapter(chapterSlug, -1);

      return {
        pages: pages,
        nextChapter: next,
        prevChapter: prev,
        currentChapter: curr,
      };
    } catch (error) {
      console.error(error);
      return {
        pages: [],
        nextChapter: null,
        prevChapter: null,
        currentChapter: null,
      };
    }
  }
}

KecskeFanSubService satisfies MangaPageConstructor;
export default KecskeFanSubService;
