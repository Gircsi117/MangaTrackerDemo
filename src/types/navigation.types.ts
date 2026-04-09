import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Library: undefined;
  Home: undefined;
  Details: { name?: string };
};

export type LibraryPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Library"
>;

export type HomePageProps = NativeStackScreenProps<RootStackParamList, "Home">;

export type DetailsPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Details"
>;
