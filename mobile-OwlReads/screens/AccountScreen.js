// screens/AccountScreen.js
import React from "react";
import { View, Image, Text} from "react-native";
import styled from "styled-components/native";
import NavigationBar from "../components/Navigation_bar"
import { TabBar } from "../components/Tab_bar";

const OwlReadsTitle = styled.Text`
  color: #fdf5e2;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  font-weight: 400;
  justify-content: center;
  align-items: center;
  text-align: center;
  marginTop: 48px;
`;

export default function AccountScreen() {
  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "Library" }, // например, тоже в Library
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user_active.png"), screen: "Account" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{ flexDirection: "column"}}>
        <OwlReadsTitle>
          OwlReads
        </OwlReadsTitle>
        <Text style = {{fontSize:30}}>Экран аккаунта</Text>
      </View>
      <NavigationBar icons={icons} />
      <TabBar color={"#D7C1AB"}/>
    </View>
  );
}
