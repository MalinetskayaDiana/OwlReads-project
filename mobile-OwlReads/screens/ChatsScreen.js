import React from "react";
import { View, FlatList } from "react-native";
import styled from "styled-components/native";
import NavigationBar from "../components/Navigation_bar";
import ChatItem from "../components/Chat_item";
import AddNewChatItem from "../components/Add_new_chat";
import { TabBar } from "../components/Tab_bar";

const OwlReadsTitle = styled.Text`
  color: #fdf5e2;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  font-weight: 400;
  text-align: center;
  margin-top: 48px;
`;

export default function ChatsScreen() {
  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "Library" },
    { name: "message", source: require("../assets/message_active.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  const chats = [
    { id: "1", title: "Букля", message: "Последнее сообщение..." },
    { id: "2", title: "Чат 2", message: "Привет!" },
    { id: "3", title: "Чат 3", message: "Как дела?" },
    { id: "4", title: "Чат 4", message: "Новая книга доступна" },
    { id: "5", title: "Чат 4", message: "Новая книга доступна" },
    { id: "6", title: "Чат 4", message: "Новая книга доступна" },
    { id: "7", title: "Чат 4", message: "Новая книга доступна" },
    { id: "8", title: "Чат 4", message: "Новая книга доступна" },
    { id: "9", title: "Чат 4", message: "Новая книга доступна" },
    { id: "10", title: "Чат 4", message: "Новая книга доступна" },
    { id: "11", title: "Чат 4", message: "Новая книга доступна" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <OwlReadsTitle>OwlReads</OwlReadsTitle>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem title={item.title} message={item.message} />

        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<AddNewChatItem />}
        contentContainerStyle={{ paddingBottom: 130 }}
      />

      <NavigationBar icons={icons} />
      <TabBar color={"#D7C1AB"}/>
    </View>
  );
}
