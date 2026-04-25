import MangaDexHuService from "./mangadex-hu.service";

class MangaDexEnService extends MangaDexHuService {
  public static readonly id = "mangadex-en";
  public static readonly name = "MangaDexEN";

  constructor(slug: string) {
    super(slug);
    this.lang = "en";
  }
}

export default MangaDexEnService;
