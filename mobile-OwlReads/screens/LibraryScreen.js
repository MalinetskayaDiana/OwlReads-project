// screens/LibraryScreen.js
import React from "react";
import { View, Image, Text, FlatList } from "react-native";
import styled from "styled-components/native";
import NavigationBar from "../components/Navigation_bar";
import { BookCard } from "../components/Book_card";
import { TabBar } from "../components/Tab_bar";

import { SafeAreaView } from 'react-native-safe-area-context';

const OwlReadsTitle = styled.Text`
  color: #fdf5e2;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  font-weight: 400;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 48px;
`;

const Separator = styled.View`
  height: 2px;
  background-color: #FDF5E2;
  margin-top: 5px;
`;


export default function LibraryScreen() {
  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book_active.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "Library" }, // например, тоже в Library
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  const books = [
    {
      id: "1",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
    {
      id: "2",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
    {
      id: "3",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
    {
      id: "4",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
    {
      id: "5",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{ flexDirection: "column"}}>
        <OwlReadsTitle>
          OwlReads
        </OwlReadsTitle>
        <Separator />
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <BookCard
            cover={item.cover}
            category={item.category}
            categorycolor={item.categorycolor}
            title={item.title}
            author={item.author}
            rating={item.rating}
            onPress={() => console.log(`Открыть книгу: ${item.title}`)}
          />
        )}
          contentContainerStyle={{ paddingBottom: 260, paddingTop: 10 }}
        />
      </View>
      <NavigationBar icons={icons} />
      <TabBar color={"#D7C1AB"}/>
    </View>
  );
}
