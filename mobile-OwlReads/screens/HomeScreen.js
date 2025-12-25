// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import Quote from "../components/Popular_quote";
import NavigationBar from "../components/Navigation_bar";
import { TabBar } from "../components/Tab_bar";
import AddBookModal from "../components/Add_book_modal";
import api from "../src/api/client";

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

export default function HomeScreen() {
  const navigation = useNavigation();
  const [quote, setQuote] = useState(null);
  
  const [isModalVisible, setModalVisible] = useState(false);

  const icons = [
    { name: "home", source: require("../assets/home_active.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "AddBookModal" }, 
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await api.get("/api/quotes/random");
        setQuote(response.data);
      } catch (error) {
        console.error("Ошибка загрузки цитаты:", error);
      }
    }
    fetchQuote();
  }, []);

  const handleNavigationPress = (screenName) => {
    if (screenName === "AddBookModal") {
      setModalVisible(true); 
    } else {
      navigation.navigate(screenName); 
    }
  };

  const handleSearch = () => {
    setModalVisible(false);
    console.log("Идем искать книгу...");
  };

  const handleAddManual = () => {
    setModalVisible(false);
    console.log("Идем добавлять вручную...");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{ flexDirection: "column" }}>
        <OwlReadsTitle>OwlReads</OwlReadsTitle>
        <Image
          source={require("../assets/Owl_and_bookshelves.png")}
          style={{ width: 368, height: 149, resizeMode: "cover", marginBottom: -4, marginLeft: 25, zIndex: 1 }}
        />
        {quote && (
          <Quote quote_text={quote.text} quote_author={`@${quote.book_title}`} />
        )}
      </View>

      <NavigationBar icons={icons} onPressOverride={handleNavigationPress} />
      
      <TabBar color={"#D7C1AB"} />

      <AddBookModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSearch={handleSearch}
        onAdd={handleAddManual}
      />
    </View>
  );
}