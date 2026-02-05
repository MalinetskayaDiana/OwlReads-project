import React, { useState, useEffect } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./screens/StartScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import EntryScreen from "./screens/EntryScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import HomeScreen from "./screens/HomeScreen";
import LibraryScreen from "./screens/LibraryScreen";
import ChatsScreen from "./screens/ChatsScreen";
import CorrespondenceScreen from "./screens/CorrespondenceScreen";
import AccountScreen from "./screens/AccountScreen";
import BookScreen from "./screens/BookScreen";
import AddBookModal from "./components/Add_book_modal";
import AddBookManualScreen from "./screens/AddBookManualScreen";
import BookSearchScreen from "./screens/BookSearchScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Marck Script-Regular": require("./assets/fonts/MarckScript-Regular.ttf"),
        "Inter-Regular": require("./assets/fonts/Inter-Regular.otf"),
        "Inter-Medium": require("./assets/fonts/Inter-Medium.otf"),
        "VollkornSC-Regular": require("./assets/fonts/VollkornSC-Regular.ttf"),
        "VollkornSC-Bold": require("./assets/fonts/VollkornSC-Bold.ttf"),
        "KoPub-Batang-Regular": require("./assets/fonts/kopubbatang-regular.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="Entry"
          component={EntryScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="Library"
          component={LibraryScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="AddBookModal"
          component={AddBookModal}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="Book"
          component={BookScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="BookManualAdd"
          component={AddBookManualScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="BookSearch"
          component={BookSearchScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="Chats"
          component={ChatsScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="Сorrespondence"
          component={CorrespondenceScreen}
          options={{ animation: "none" }} />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ animation: "none" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
