import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChapterSlug, MangaPageConstructor } from "./manga.type";

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
  Browsing: undefined;
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

export type BrowsingPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Browsing"
>;

export type SettingsPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;
