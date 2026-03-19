import React, { useEffect, useState, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Quote from "../components/Popular_quote";
import NavigationBar from "../components/Navigation_bar";
import { TabBar } from "../components/Tab_bar";
import AddBookModal from "../components/Add_book_modal";
import api from "../src/api/client";

// --- СТИЛИ ---

const OwlReadsTitle = styled.Text`
  color: #fdf5e2;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  font-weight: 400;
  text-align: center;
  margin-top: 48px;
`;

const SectionTitle = styled.Text`
  font-family: "Marck Script-Regular";
  font-size: 25px;
  color: #890524;
  margin-left: 16px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const BookItem = styled(TouchableOpacity)`
  width: 75px;
  margin-right: 15px;
  align-items: center;
`;

const BookCover = styled.Image`
  width: 70px;
  height: 103px;
  border-radius: 5px;
`;

const BookTitleSnippet = styled.Text`
  font-family: "Inter-Regular";
  font-size: 11px;
  color: #2F2017;
  margin-top: 5px;
  text-align: center;
  height: 30px;
`;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [quote, setQuote] = useState(null);
  const [readingBooks, setReadingBooks] = useState([]); // Состояние для книг
  const [isModalVisible, setModalVisible] = useState(false);

  const icons = [
    { name: "home", source: require("../assets/home_active.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "AddBookModal" },
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  // Загрузка случайной цитаты
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

  // Загрузка книг категории "Читаю"
  // Используем useFocusEffect, чтобы список обновлялся, когда пользователь возвращается на главный экран
  useFocusEffect(
    useCallback(() => {
      const fetchReadingBooks = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (!userId) return;

          // Вызываем ваш эндпоинт фильтрации по категории
          const response = await api.get(`/api/users_book_review/users/${userId}/reviews/by_category`, {
            params: { category_name: "Читаю" }
          });
          setReadingBooks(response.data);
        } catch (error) {
          console.error("Ошибка загрузки читаемых книг:", error);
        }
      };

      fetchReadingBooks();
    }, [])
  );

  const handleNavigationPress = (screenName) => {
    if (screenName === "AddBookModal") {
      setModalVisible(true);
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <FlatList
        ListHeaderComponent={
          <>
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

            {/* Блок "Читаю сейчас" */}
            {readingBooks.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <SectionTitle>Читаю сейчас</SectionTitle>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={readingBooks}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
                  // Внутри renderItem в HomeScreen.js
                  renderItem={({ item }) => {
                    const cover = item.book?.cover_url;
                    const title = item.book?.work?.title || "Без названия";

                    // Безопасная проверка baseURL
                    const baseUrl = api.defaults.baseURL || "";
                    const fullCoverUrl = cover
                      ? (cover.startsWith('http') ? cover : `${baseUrl}${cover}`)
                      : null;

                    return (
                      <BookItem onPress={() => navigation.navigate("Book", { reviewId: item.id })}>
                        <BookCover
                          source={fullCoverUrl ? { uri: fullCoverUrl } : require("../assets/default_cover_book.png")}
                          resizeMode="cover"
                        />
                        <BookTitleSnippet numberOfLines={2}>
                          {title}
                        </BookTitleSnippet>
                      </BookItem>
                    );
                  }}
                />
              </View>
            )}
          </>
        }
        data={[]} // Основной FlatList используем как контейнер со скроллом
        renderItem={null}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <NavigationBar icons={icons} onPressOverride={handleNavigationPress} />
      <TabBar color={"#D7C1AB"} />

      <AddBookModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSearch={() => { setModalVisible(false); navigation.navigate("BookSearch"); }}
        onAdd={() => { setModalVisible(false); navigation.navigate("BookManualAdd"); }}
      />
    </View>
  );
}