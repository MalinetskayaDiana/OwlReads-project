// screens/HomeScreen.js
import React from "react";
import { View, Image, Text } from "react-native";
import styled from "styled-components/native";
import Quote from "../components/Popular_quote";
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

export default function HomeScreen() {
  const icons = [
    { name: "home", source: require("../assets/home_active.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "Library" },
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{ flexDirection: "column"}}>
        <OwlReadsTitle>
          OwlReads
        </OwlReadsTitle>

        <Image
          source={require("../assets/Owl_and_bookshelves.png")}
          style={{
            width: 368,
            height: 149,
            resizeMode: "cover",
            marginBottom: -4,
            marginLeft: 25,
            zIndex: 1,
          }}
        />
        <Quote
          quote_text="Вот мой секрет, он очень прост: зорко одно лишь сердце. Самого главного глазами не увидишь"
          quote_author="@Маленький принц"
        />
      </View>
      <NavigationBar icons={icons} />
      <TabBar color={"#D7C1AB"}/>
    </View>
  );
}
