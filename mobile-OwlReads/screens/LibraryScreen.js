import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableWithoutFeedback, ActivityIndicator, Text } from "react-native";
import styled from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// Импорты компонентов
import NavigationBar from "../components/Navigation_bar";
import { BookCard } from "../components/Book_card";
import { TabBar } from "../components/Tab_bar";
import { TextBox } from "../components/TextBox_props";
import RatingStars from "../components/Rating_starts";
import RedButton from "../components/Red_button";
import AddBookModal from "../components/Add_book_modal"; 
import api from "../src/api/client"; // <--- API клиент

// ... (Стили оставляем без изменений: OwlReadsTitle, Separator, Overlay и т.д.) ...
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
const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  flex: 1;
  align-items: center;
  bottom: 0;
  position: absolute;
  width: 100%;
  padding: 12px;
  gap: 8px;
  padding-bottom: 60px;
`;
const OverlayCover = styled.Image`
  height: ${({ height }) => height || 160}px;
  width: ${({ width }) => width || 110}px;
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
  
  // --- Новые состояния ---
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book_active.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "AddBookModal" },
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  const handleNavigationPress = (screenName) => {
    if (screenName === "AddBookModal") {
      setAddBookModalVisible(true);
    } else {
      navigation.navigate(screenName);
    }
  };

  const handleSearchBook = () => {
    setAddBookModalVisible(false);
    navigation.navigate("SearchBook"); // Убедись, что экран так называется в App.js
  };

  const handleAddManual = () => {
    setAddBookModalVisible(false);
    navigation.navigate("AddBookManual");
  };

  // --- Загрузка книг ---
  useFocusEffect(
    useCallback(() => {
      const fetchLibrary = async () => {
        setLoading(true);
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (!userId) return;

          const response = await api.get(`/api/users_book_review/library/${userId}`);
          setBooks(response.data);
        } catch (error) {
          console.error("Ошибка загрузки библиотеки:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchLibrary();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{ flexDirection: "column", flex: 1 }}>
        <OwlReadsTitle>OwlReads</OwlReadsTitle>
        <Separator />
        
        {loading ? (
          <ActivityIndicator size="large" color="#890524" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => String(item.review_id)}
            renderItem={({ item }) => (
              <BookCard
                cover={item.cover_url ? { uri: item.cover_url } : require("../assets/cover.png")}
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
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#2F2017', fontFamily: 'Inter-Regular' }}>
                В вашей библиотеке пока нет книг.
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
        onSearch={handleSearchBook}
        onAdd={handleAddManual}
      />

      {/* Оверлей */}
      {overlayVisible && selectedBook && (
        <TouchableWithoutFeedback onPress={() => setOverlayVisible(false)}>
          <Overlay>
            <Circle />
            <OverlayContent>
              <OverlayCover 
                source={selectedBook.cover_url ? { uri: selectedBook.cover_url } : require("../assets/cover.png")} 
                resizeMode="cover" 
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
              
              {/* Переход к деталям книги (нужно будет передать ID) */}
              <RedButton 
                name={"Подробнее"} 
                onPress={() => {
                    setOverlayVisible(false);
                    navigation.navigate("Book", { reviewId: selectedBook.review_id });
                    console.log("Переход к книге:", selectedBook.review_id);
                }}
              />
            </OverlayContent>
          </Overlay>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}