import MangaPage from "../modules/manga-page.module";
import axios from "axios";
import { Chapter, ChapterPage, ChapterSlug, Manga } from "../types/manga.type";

class ToonVerseService extends MangaPage {
  private static readonly NAME = "ToonVerse";
  private static readonly BASE_URL = "https://api.toonverse.net/api";
  public static readonly referer = "https://api.toonverse.net/";
  private static readonly axios = axios.create({
    baseURL: this.BASE_URL,
    headers: {
      Referer: this.referer,
      "User-Agent": this.userAgent,
    },
  });

  public static async search(): Promise<Manga[]> {
    return [];
  }

  public async getManga(): Promise<Manga | null> {
    try {
      if (this.manga) return this.manga;

      const result = await ToonVerseService.axios({
        method: "GET",
        url: `/series/slug/${this.slug}`,
      });

      const data = result.data.data;

      this.manga = {
        id: data.id,
        slug: this.slug,
        title: data.title,
        coverUrl: data.coverUrl,
        author: data.author,
        type: data.type,
        description: data.description,
      } as Manga;

      return this.manga;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getChapters(): Promise<Chapter[]> {
    try {
      const manga = await this.getManga();

      if (!manga) return [];

      const result = await ToonVerseService.axios({
        method: "GET",
        url: `/series/${manga.id}/chapters`,
        params: {
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0,
          order: "desc",
        },
      });

      const { chapters = [] } = result.data.data;

      //console.log(chapters);

      return chapters.map(
        (x: any) =>
          ({
            id: x.id,
            number: x.number,
            slug: x.number,
            title: x.title,
            publishedAt: x.publishedAt ? new Date(x.publishedAt) : null,
          }) as Chapter,
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getChapterPages(
    chapterSlug: ChapterSlug,
  ): Promise<ChapterPage[]> {
    try {
      const result = await ToonVerseService.axios({
        method: "GET",
        url: `/reading/chapter/${this.slug}/${chapterSlug}`,
      });

      const { chapter } = result.data.data;
      const { pages = [] } = chapter;

      const withSize: ChapterPage[] = await Promise.all(
        pages
          .map((x: any, i: number) => ({ index: i, ...x }))
          .map(async (x: any) => {
            const imageUrl = x.imageUrl;
            //const { width, height } = await Image.getImageSize(imageUrl);

            const result: ChapterPage = {
              id: x.id,
              index: x.index,
              imageUrl,
              width: 2,
              height: 3,
            };

            return result;
          }),
      );

      return withSize.sort((a, b) => a.index - b.index);
    } catch (error) {
      console.error(error);

      return [];
    }
  }
}

export default ToonVerseService;
