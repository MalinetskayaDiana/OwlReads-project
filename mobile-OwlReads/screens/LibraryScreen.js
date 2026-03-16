import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableWithoutFeedback, ActivityIndicator, Text, TouchableOpacity, Image, Keyboard } from "react-native";
import styled from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import NavigationBar from "../components/Navigation_bar";
import { BookCard } from "../components/Book_card";
import { TabBar } from "../components/Tab_bar";
import { TextBox } from "../components/TextBox_props";
import RatingStars from "../components/Rating_starts";
import RedButton from "../components/Red_button";
import AddBookModal from "../components/Add_book_modal";
import InputField from "../components/Input_field";
import api from "../src/api/client";

// --- СТИЛИ ---

const OwlReadsTitle = styled.Text`
  color: #fdf5e2;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  text-align: center;
  margin-top: 48px;
`;

const Separator = styled.View`
  height: 2px;
  background-color: #FDF5E2;
  margin-top: 5px;
`;

const SearchSection = styled.View`
  margin-horizontal: 16px;
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const SearchButton = styled.TouchableOpacity`
  background-color: #6C5141;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
  height: 43px; 
  width: 43px;
`;

const BookCountText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 13px;
  color: #A28C75;
  margin-left: 16px;
  margin-top: 8px;
  margin-bottom: 6px;
`;

// СТИЛИ ОВЕРЛЕЯ (КОТОРЫЕ БЫЛИ ПОТЕРЯНЫ)
const Overlay = styled.View`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.65);
  justify-content: flex-end;
  align-items: center;
`;

const Circle = styled.View`
  position: absolute;
  bottom: -337px;
  width: 770px;
  height: 770px;
  border-radius: 385px;
  background-color: #FDF5E2;
`;

const OverlayContent = styled.View`
  align-items: center;
  bottom: 0;
  position: absolute;
  width: 100%;
  padding: 12px;
  gap: 8px;
  padding-bottom: 60px;
`;

const OverlayCover = styled.Image`
  height: 160px;
  width: 110px;
  border-radius: 7px;
`;

const OverlayTitle = styled.Text`
  font-family: VollkornSC-Regular;
  font-size: 17px;
  color: #890524;
  align-self: flex-start;
`;

const OverlayAuthor = styled.Text`
  font-family: Inter-Regular;
  font-size: 14px;
  color: #2F2017;
  align-self: flex-start;
`;

export default function LibraryScreen() {
  const navigation = useNavigation();

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddBookModalVisible, setAddBookModalVisible] = useState(false);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book_active.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "AddBookModal" },
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  const fetchLibrary = async (query = "") => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await api.get(`/api/users_book_review/library/${userId}`, {
        params: { q: query } // Серверный поиск
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Ошибка загрузки библиотеки:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLibrary(searchQuery);
    }, [])
  );

  const handlePressSearch = () => {
    Keyboard.dismiss();
    fetchLibrary(searchQuery);
  };

  const handleNavigationPress = (screenName) => {
    if (screenName === "AddBookModal") {
      setAddBookModalVisible(true);
    } else {
      navigation.navigate(screenName);
    }
  };

  const getFullCoverUrl = (cover) => {
    if (!cover) return require("../assets/default_cover_book.png");
    if (cover.startsWith('http')) return { uri: cover };
    return { uri: `${api.defaults.baseURL}${cover}` };
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{ flexDirection: "column", flex: 1 }}>
        <OwlReadsTitle>OwlReads</OwlReadsTitle>
        <Separator />

        <SearchSection>
          <View style={{ flex: 1 }}>
            <InputField
              placeholder="Поиск"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ marginHorizontal: 0 }}
              containerHeight={43} // Передаем высоту 43
              fontSize={14}        // Размер шрифта внутри
              returnKeyType="search"
              onSubmitEditing={handlePressSearch}
            />
          </View>
          <SearchButton onPress={handlePressSearch}>
            <Image
              source={require("../assets/search.png")}
              style={{ width: 22, height: 22, tintColor: '#FDF5E2' }}
            />
          </SearchButton>
        </SearchSection>

        <BookCountText>Всего книг: {books.length}</BookCountText>

        {loading ? (
          <ActivityIndicator size="large" color="#890524" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => String(item.review_id)}
            renderItem={({ item }) => (
              <BookCard
                cover={getFullCoverUrl(item.cover_url)}
                category={item.category_name}
                categorycolor={item.category_color}
                title={item.title}
                author={item.author}
                rating={item.rating}
                onPress={() => {
                  setSelectedBook(item);
                  setOverlayVisible(true);
                }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 5 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#2F2017', fontFamily: 'Inter-Regular' }}>
                Ничего не найдено
              </Text>
            }
          />
        )}
      </View>

      <NavigationBar icons={icons} onPressOverride={handleNavigationPress} />
      {!isAddBookModalVisible && <TabBar color={"#D7C1AB"} />}

      <AddBookModal
        visible={isAddBookModalVisible}
        onClose={() => setAddBookModalVisible(false)}
        onSearch={() => { setAddBookModalVisible(false); navigation.navigate("BookSearch"); }}
        onAdd={() => { setAddBookModalVisible(false); navigation.navigate("BookManualAdd"); }}
      />

      {/* ОВЕРЛЕЙ ТЕПЕРЬ С КОДОМ */}
      {overlayVisible && selectedBook && (
        <TouchableWithoutFeedback onPress={() => setOverlayVisible(false)}>
          <Overlay>
            <Circle />
            <OverlayContent>
              <OverlayCover
                source={getFullCoverUrl(selectedBook.cover_url)} 
                resizeMode="contain"
              />
              <View style={{ alignSelf: 'center' }}>
                <TextBox text={selectedBook.category_name} color={selectedBook.category_color} />
              </View>
              <OverlayTitle>{selectedBook.title}</OverlayTitle>
              <OverlayAuthor>{selectedBook.author}</OverlayAuthor>
              <View style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                <RatingStars
                  rating={selectedBook.rating}
                  size={40}
                  filledImage={require('../assets/star_filled.png')}
                  emptyImage={require('../assets/star_empty.png')}
                />
              </View>
              <RedButton
                name={"Подробнее"}
                onPress={() => {
                  setOverlayVisible(false);
                  navigation.navigate("Book", { reviewId: selectedBook.review_id });
                }}
              />
            </OverlayContent>
          </Overlay>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}