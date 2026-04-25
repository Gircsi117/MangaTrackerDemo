import AsuraScansService from "../services/manga_services/asurascans.service";
import KecskeFanSubService from "../services/manga_services/kecskefansub.service";
import MangaBuddyService from "../services/manga_services/mangabuddy.service";
import MangaDexEnService from "../services/manga_services/mangadex-en.service";
import MangaDexHuService from "../services/manga_services/mangadex-hu.service";
import ManhwaManiaService from "../services/manga_services/manhwamania.service";
import NHentaiService from "../services/manga_services/nhentai.service";
import PadlizsanFanSubService from "../services/manga_services/padlizsanfansub.service";
import ToonVerseService from "../services/manga_services/toonverse.service";

export default [
  AsuraScansService,
  KecskeFanSubService,
  MangaBuddyService,
  MangaDexEnService,
  MangaDexHuService,
  ManhwaManiaService,
  NHentaiService,
  PadlizsanFanSubService,
  ToonVerseService,
].sort((a, b) => a.name.localeCompare(b.name));
