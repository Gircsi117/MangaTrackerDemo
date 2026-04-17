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
import { v4 as uuidv4 } from "uuid";
import { List, ListParams } from "../types/list.types";

class MangaBuddyService extends MangaPage {
  public static readonly id = "mangabuddy";
  public static readonly name = "MangaBuddy";
  private static readonly baseUrl = "https://mangabuddy.com";
  public static readonly referer = "https://mangabuddy.com/";
  public static readonly logoUrl =
    "https://mangabuddy.com/static/sites/mangabuddy/icons/android-chrome-192x192.png";

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

      const page = offset / limit + 1;

      const res = await MangaBuddyService.axios({
        method: "GET",
        url: `/search`,
        params: {
          q: query,
          status: "all",
          page: page,
          limit: limit,
          offset: offset,
        },
      });

      const root = parse(res.data);
      const items = root.querySelectorAll(".book-detailed-item");

      const paginationCount =
        root
          .querySelector(".paginator")
          ?.querySelectorAll("a")
          .pop()
          ?.text.trim() || "1";

      const mangas = items.map((item) => {
        const title =
          item.querySelector("a")?.getAttribute("title") || "Unknown";
        const slug =
          item.querySelector("a")?.getAttribute("href")?.replace("/", "") || "";
        const coverUrl =
          item
            .querySelector(".thumb")
            ?.querySelector("a")
            ?.querySelector("img")
            ?.getAttribute("data-src") || "";
        const description =
          item.querySelector(".summary")?.querySelector("p")?.text.trim() || "";

        const manga: Manga = {
          id: slug,
          slug,
          title,
          coverUrl,
          author: "",
          description,
          type: "unknown",
        };

        return manga;
      });

      return {
        items: mangas,
        totalCount: mangas.length * Number(paginationCount),
      };
    } catch (error) {
      console.error(error);
      return { items: [], totalCount: 0 };
    }
  }

  public async getManga(): Promise<Manga | null> {
    try {
      if (this.manga) return this.manga;

      const res = await MangaBuddyService.axios({
        method: "GET",
        url: `/${this.slug}`,
      });
      const root = parse(res.data);

      const bookInfo = root.querySelector(".book-info");
      const title = bookInfo?.querySelector("h1")?.text.trim() || "Unknown";
      const coverUrl =
        bookInfo?.querySelector("#cover img")?.getAttribute("data-src") || "";
      const description = root.querySelector(".content")?.text.trim() || "";

      this.manga = {
        id: uuidv4(),
        slug: this.slug,
        title,
        coverUrl,
        author: "Unknown",
        description,
        type: "unknown",
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

      const res = await MangaBuddyService.axios({
        method: "GET",
        url: `/${this.slug}`,
      });
      const root = parse(res.data);

      const chapterList = root
        .querySelectorAll("#chapter-list li")
        .map((li) => ({
          id: li.getAttribute("id") || "",
          slug:
            li.querySelector("a")?.getAttribute("href")?.split("/").pop() || "",
          number: Number(li.getAttribute("id")?.split("-")[1] || "0"),
          title: li.querySelector(".chapter-title")?.text.trim() || "",
          publishedAt: null,
        }));

      const chapters = chapterList
        .filter((chapter) => !!chapter.slug)
        .sort((a, b) => b.number - a.number) as Chapter[];

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
      const res = await MangaBuddyService.axios({
        method: "GET",
        url: `/${this.slug}/${chapterSlug}`,
      });

      const match = res.data.match(/var chapImages = '([^']+)'/);
      if (!match)
        return {
          pages: [],
          currentChapter: null,
          nextChapter: null,
          prevChapter: null,
        };

      const pages: ChapterPage[] = match[1]
        .split(",")
        .map((url: string, index: number) => {
          const page: ChapterPage = {
            id: String(index),
            index,
            imageUrl: url.trim(),
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

MangaBuddyService satisfies MangaPageConstructor;
export default MangaBuddyService;
