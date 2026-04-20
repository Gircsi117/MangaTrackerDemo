import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation.type";
import LibraryPage from "./pages/LibraryPage";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
import MangaPage from "./pages/MangaPage";
import ChapterPage from "./pages/ChapterPage";
import BrowsingPage from "./pages/BrowsingPage";
import SearchPage from "./pages/SearchPage";
import useCredentialsStore from "./stores/credentials.store";
import CredentialsPage from "./pages/CredentialsPage";
import Toast from "react-native-toast-message";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "./db/db";
import migrations from "../drizzle/migrations";
import Container from "./components/Container";
import { Text, View } from "react-native";
import styles from "./styles/styles";

const Stack = createNativeStackNavigator<RootStackParamList>();
useCredentialsStore.getState().load();

export default function App() {
  const DEFAULT_PAGE: keyof RootStackParamList = "Library";

  const { success, error } = useMigrations(db, migrations);

  if (error)
    return (
      <Container>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.text}>Migration error: {error.message}</Text>
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
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
      <StatusBar style="auto" />
    </>
  );
}
