import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import { RootStackParamList } from "./types/navigation.types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false, animation: "none" }}
        >
          <Stack.Screen name="Home">
            {(props) => <HomePage {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Details">
            {(props) => <DetailsPage {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}
