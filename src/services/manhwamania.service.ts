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
import { ListParams, List } from "../types/list.types";
import { v4 as uuidv4 } from "uuid";
class ManhwaManiaService extends MangaPage {
  public static readonly id: string = "manhwamania";
  public static readonly name: string = "ManhwaMania";
  protected static readonly origin = "https://manhwamania.hu";
  protected static readonly referer: string = "https://manhwamania.hu";
  public static readonly logoUrl: string =
    "https://1000logos.net/wp-content/uploads/2022/02/Manhwaindo-Logo.png";

  private static readonly axios = axios.create({
    baseURL: this.origin + "/api",
    headers: this.headers,
  });

  public get mangaUrl(): string {
    return ``;
  }

  private static formatFolder(folderFormat: string, chapter: number): string {
    return folderFormat
      .replace("%03d", chapter.toString().padStart(3, "0"))
      .replace("%02d", chapter.toString().padStart(2, "0"))
      .replace("%d", chapter.toString());
  }

  private static generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  private static async getSlugs() {
    try {
      const response = await axios.get("https://manhwamania.hu");
      const match = (response.data as string).match(
        /const titleToRoute\s*=\s*(\{[\s\S]*?\});/,
      );
      if (match) return JSON.parse(match[1]) as Record<string, string>;
      return {};
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  public static async search(params: ListParams): Promise<List<Manga>> {
    try {
      const { query = "" } = params;

      const slugs = await this.getSlugs();

      const res = await this.axios({
        method: "GET",
        url: "/get_all_series.php",
      });

      const { series } = res.data;

      const mangas: Manga[] = series
        .map((x: any) => {
          const manga: Manga = {
            id: x.id,
            slug: slugs[x.title] || this.generateSlug(x.title) || "",
            title: x.title,
            coverUrl: `${this.origin}/${x.cover}`,
            description: x.description,
            author: "",
            type: "",
          };

          return manga;
        })
        .filter((x: Manga) => x.slug)
        .filter((x: Manga) =>
          x.title.toLowerCase().includes(query.toLowerCase()),
        );

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

  async getManga(): Promise<Manga | null> {
    try {
      const res = await ManhwaManiaService.search({});

      this.manga = res.items.find((x) => x.slug == this.slug) || null;

      return this.manga;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getChapters(): Promise<Chapter[]> {
    try {
      const manga = await this.getManga();
      if (!manga) return [];

      const res = await ManhwaManiaService.axios({
        method: "GET",
        url: "/get_chapters.php",
        params: {
          series_id: manga.id,
        },
      });

      const { chapters } = res.data;

      this.chapters = chapters.map((x: any) => {
        const chapter: Chapter = {
          id: uuidv4(),
          slug: ManhwaManiaService.formatFolder("%02d - Chapter %d", x.number),
          number: x.number,
          title: `Chapter ${x.number}`,
          publishedAt: new Date(x.date),
        };

        return chapter;
      });

      return this.chapters;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  async getChapterContent(chapterSlug: ChapterSlug): Promise<ChapterContent> {
    try {
      const folder = `${this.slug}/${chapterSlug}`;

      const res = await ManhwaManiaService.axios({
        method: "GET",
        url: "/get_chapter_images.php",
        params: {
          folder: folder,
        },
      });

      const { images = [] } = res.data;

      const pages: ChapterPage[] = images.map((x: string, index: number) => {
        const page: ChapterPage = {
          id: uuidv4(),
          index,
          imageUrl: `${ManhwaManiaService.origin}/fejezetek/${folder}/${x}`,
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

ManhwaManiaService satisfies MangaPageConstructor;
export default ManhwaManiaService;
