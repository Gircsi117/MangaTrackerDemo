import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MangaPage from "../modules/manga-page.module";
import { ChapterSlug } from "./manga.type";

type MangaPageConstructor = new (slug: string) => MangaPage;

export type RootStackParamList = {
  Library: undefined;
  History: undefined;
  Settings: undefined;
  Manga: { slug: string; service: MangaPageConstructor };
  Chapter: {
    slug: string;
    chapterSlug: ChapterSlug;
    service: MangaPageConstructor;
  };
};

export type HistoryPageProps = NativeStackScreenProps<
  RootStackParamList,
  "History"
>;

export type LibraryPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Library"
>;

export type MangaPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Manga"
>;

export type ChapterPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Chapter"
>;

export type SettingsPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;
