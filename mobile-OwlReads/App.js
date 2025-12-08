import React, { useState, useEffect } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LibraryScreen from "./screens/LibraryScreen";
import ChatsScreen from "./screens/ChatsScreen";
import AccountScreen from "./screens/AccountScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Marck Script-Regular": require("./assets/fonts/MarckScript-Regular.ttf"),
        "Inter-Regular": require("./assets/fonts/Inter-Regular.otf"),
        "Inter-Medium": require("./assets/fonts/Inter-Medium.otf"),
        "VollkornSC-Regular" : require("./assets/fonts/VollkornSC-Regular.ttf"),
        "VollkornSC-Bold" : require("./assets/fonts/VollkornSC-Bold.ttf"),
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
          name="Home" 
          component={HomeScreen} 
          options={{ animation: "none" }}/>
        <Stack.Screen 
          name="Library" 
          component={LibraryScreen} 
          options={{ animation: "none" }}/>
        <Stack.Screen 
          name="Chats" 
          component={ChatsScreen} 
          options={{ animation: "none" }}/>
        <Stack.Screen 
          name="Account" 
          component={AccountScreen} 
          options={{ animation: "none" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
