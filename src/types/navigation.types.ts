import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Details: { name?: string };
};

export type HomePageProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type DetailsPageProps = NativeStackScreenProps<
  RootStackParamList,
  "Details"
>;
