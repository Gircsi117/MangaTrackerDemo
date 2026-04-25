import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation.type";
import LibraryPage from "./pages/LibraryPage";
import SettingsPage from "./pages/settings/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
import MangaPage from "./pages/manga/MangaPage";
import ChapterPage from "./pages/manga/ChapterPage";
import BrowsingPage from "./pages/browsing/BrowsingPage";
import SearchPage from "./pages/browsing/SearchPage";
import useCredentialsStore from "./stores/credentials.store";
import CredentialsPage from "./pages/settings/CredentialsPage";
import Toast from "react-native-toast-message";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations/migrations";
import Container from "./components/Container";
import { Text, View } from "react-native";
import styles from "./styles/styles";
import CategoryPage from "./pages/CategoryPage";
import DrizzleDB from "./db/db";
import Button from "./components/Button";

const Stack = createNativeStackNavigator<RootStackParamList>();
useCredentialsStore.getState().load();

export default function App() {
  const DEFAULT_PAGE: keyof RootStackParamList = "Library";

  const { success, error } = useMigrations(DrizzleDB.main, migrations);

  if (error)
    return (
      <Container>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.text}>Migration error: {error.message}</Text>
          <Button onPress={() => DrizzleDB.deleteMain()}>Delete DB</Button>
        </View>
      </Container>
    );

  if (!success)
    return (
      <Container>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.text}>Migrations...</Text>
        </View>
      </Container>
    );

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={DEFAULT_PAGE}
          screenOptions={{ headerShown: false, animation: "none" }}
        >
          <Stack.Screen name="Library">
            {(props) => <LibraryPage {...props} />}
          </Stack.Screen>

          <Stack.Screen name="History">
            {(props) => <HistoryPage {...props} />}
          </Stack.Screen>

          <Stack.Screen name="Manga">
            {(props) => <MangaPage {...props} />}
          </Stack.Screen>

          <Stack.Screen name="Chapter">
            {(props) => <ChapterPage {...props} />}
          </Stack.Screen>

          <Stack.Screen name="Browsing">
            {(props) => <BrowsingPage {...props} />}
          </Stack.Screen>

          <Stack.Screen name="Search">
            {(props) => <SearchPage {...props} />}
          </Stack.Screen>

          <Stack.Screen name="Settings">
            {(props) => <SettingsPage {...props} />}
          </Stack.Screen>

          <Stack.Screen name="Credentials">
            {(props) => <CredentialsPage {...props} />}
          </Stack.Screen>

          <Stack.Screen name="Category">
            {(props) => <CategoryPage {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
      <StatusBar style="auto" />
    </>
  );
}
