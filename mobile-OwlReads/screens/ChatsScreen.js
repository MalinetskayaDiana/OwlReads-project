import React, { useState } from "react";
import { View, FlatList } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native"; // <--- 1. Импорт навигации

// Импорты компонентов
import NavigationBar from "../components/Navigation_bar";
import ChatItem from "../components/Chat_item";
import AddNewChatItem from "../components/Add_new_chat";
import { TabBar } from "../components/Tab_bar";
import AddBookModal from "../components/Add_book_modal"; // <--- 2. Импорт модалки

const OwlReadsTitle = styled.Text`
  color: #fdf5e2;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  font-weight: 400;
  text-align: center;
  margin-top: 48px;
`;

export default function ChatsScreen() {
  const navigation = useNavigation(); // <--- 3. Хук навигации
  const [isAddBookModalVisible, setAddBookModalVisible] = useState(false); // <--- 4. Состояние модалки

  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "AddBookModal" }, // <--- 5. Указываем screen для перехвата
    { name: "message", source: require("../assets/message_active.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  const chats = [
    // Пока пустой список, как в твоем примере
  ];

  // --- 6. Логика перехвата нажатия ---
  const handleNavigationPress = (screenName) => {
    if (screenName === "AddBookModal") {
      setAddBookModalVisible(true);
    } else {
      navigation.navigate(screenName);
    }
  };

  // Заглушки для действий
  const handleSearchBook = () => {
    setAddBookModalVisible(false);
    console.log("Поиск книги");
    // navigation.navigate("SearchBook");
  };

  const handleAddManual = () => {
    setAddBookModalVisible(false);
    console.log("Добавление вручную");
    // navigation.navigate("AddBookManual");
  };

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

      {/* 7. Передаем перехватчик */}
      <NavigationBar icons={icons} onPressOverride={handleNavigationPress} />
      
      {/* 8. Скрываем TabBar при открытии меню */}
      {!isAddBookModalVisible && <TabBar color={"#D7C1AB"}/>}

      {/* 9. Модальное окно */}
      <AddBookModal 
        visible={isAddBookModalVisible}
        onClose={() => setAddBookModalVisible(false)}
        onSearch={handleSearchBook}
        onAdd={handleAddManual}
      />
    </View>
  );
}