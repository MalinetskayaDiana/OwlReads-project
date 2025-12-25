import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Image, ActivityIndicator, Text, Keyboard } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios"; 
import api from "../src/api/client"; // Наш клиент для бэкенда

import InputField from "../components/Input_field";

// ... (Стили Header, OwlReadsTitle оставляем без изменений) ...
const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-horizontal: 16px;
  margin-bottom: 20px;
  padding-top: 10px;
`;

const OwlReadsTitle = styled.Text`
  color: #230109;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  font-weight: 400;
  text-align: center;
`;

const ResultItem = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #FDF5E2;
  border-radius: 12px;
  padding: 10px;
  margin-horizontal: 16px;
  margin-bottom: 12px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  border-width: 1px;
  /* Если книга из нашей базы - подсветим рамку */
  border-color: ${({ isLocal }) => (isLocal ? "#890524" : "transparent")};
`;

const BookCover = styled.Image`
  width: 60px;
  height: 90px;
  border-radius: 4px;
  background-color: #E8DFC9;
`;

const BookInfo = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: center;
`;

const BookTitle = styled.Text`
  font-family: "VollkornSC-Bold";
  font-size: 16px;
  color: #890524;
  margin-bottom: 4px;
`;

const BookAuthor = styled.Text`
  font-family: "Inter-Medium";
  font-size: 14px;
  color: #2F2017;
`;

const SourceBadge = styled.Text`
  font-family: "Inter-Regular";
  font-size: 10px;
  color: #A28C75;
  margin-top: 4px;
`;

const EmptyText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 14px;
  color: #2F2017;
  text-align: center;
  margin-top: 20px;
  opacity: 0.6;
`;

const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 16px;
  margin-bottom: 20px;
  gap: 10px;
`;

const SearchButton = styled.TouchableOpacity`
  background-color: #890524;
  padding: 12px;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
`;

export default function SearchBookScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    Keyboard.dismiss();
    setLoading(true);
    setResults([]); // Очищаем старые результаты
    
    console.log("Начинаем поиск:", query);

    try {
      // Запускаем два запроса параллельно: к нашему API и к Google
      const [localResponse, googleResponse] = await Promise.allSettled([
        api.get(`/api/literature/search?q=${query}`),
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`)
      ]);

      let combinedResults = [];

      // 1. Обрабатываем ответ от НАШЕГО сервера
      if (localResponse.status === 'fulfilled') {
        const localBooks = localResponse.value.data.map(book => ({
          id: `local_${book.id}`, // Уникальный ID
          originalId: book.id,    // ID в нашей БД
          title: book.title,
          author: book.author,
          year: book.year,
          cover: book.cover_url,
          source: 'local'         // Метка источника
        }));
        combinedResults = [...combinedResults, ...localBooks];
      }

      // 2. Обрабатываем ответ от Google Books
      if (googleResponse.status === 'fulfilled') {
        const items = googleResponse.value.data.items || [];
        const googleBooks = items.map((item) => {
          const info = item.volumeInfo;
          return {
            id: item.id,
            title: info.title,
            author: info.authors ? info.authors.join(", ") : "Неизвестный автор",
            pages: info.pageCount,
            year: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : null,
            language: info.language,
            description: info.description,
            cover: info.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
            source: 'google'
          };
        });
        combinedResults = [...combinedResults, ...googleBooks];
      }

      setResults(combinedResults);

    } catch (error) {
      console.error("Ошибка поиска:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book) => {
    // Передаем книгу на экран добавления
    // Если source === 'local', мы знаем, что книга уже есть в БД (можно передать её ID)
    // Если source === 'google', мы просто заполняем поля
    navigation.navigate("BookManualAdd", { book: book });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FDF5E2" }}>
      
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35 }}>
            <Image source={require("../assets/chevron_left.png")} style={{ width: 35, height: 35 }} resizeMode="contain" />
          </TouchableOpacity>
          <OwlReadsTitle>OwlReads</OwlReadsTitle>
          <View style={{ width: 35 }} />
        </Header>

        {/* Обновленная строка поиска */}
        <SearchRow>
          <View style={{ flex: 1 }}>
            <InputField 
              placeholder="Название или автор..." 
              value={query}
              onChangeText={setQuery}
              style={{ width: 'auto', marginHorizontal: 0 }} // Убираем отступы самого поля, так как они есть у SearchRow
              
              // Теперь эти пропсы будут работать благодаря исправлению в Шаге 1:
              returnKeyType="search"
              onSubmitEditing={handleSearch} 
            />
          </View>

          <SearchButton onPress={handleSearch}>
            <Image 
              source={require("../assets/search.png")} // Убедись, что есть иконка лупы, или используй add_book временно
              style={{ width: 24, height: 24, tintColor: '#FDF5E2' }} 
            />
          </SearchButton>
        </SearchRow>

        {loading ? (
          <ActivityIndicator size="large" color="#890524" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <EmptyText>
                {query ? "Ничего не найдено" : "Введите запрос для поиска"}
              </EmptyText>
            }
            renderItem={({ item }) => (
              <ResultItem 
                onPress={() => handleSelectBook(item)}
                isLocal={item.source === 'local'} // Передаем проп для стиля
              >
                {item.cover ? (
                  <BookCover source={{ uri: item.cover }} resizeMode="cover" />
                ) : (
                  <BookCover source={require("../assets/cover.png")} resizeMode="cover" />
                )}
                
                <BookInfo>
                  <BookTitle numberOfLines={2}>{item.title}</BookTitle>
                  <BookAuthor numberOfLines={1}>{item.author}</BookAuthor>
                  <SourceBadge>
                    {item.source === 'local' ? "В библиотеке OwlReads" : "Google Books"}
                  </SourceBadge>
                </BookInfo>
              </ResultItem>
            )}
          />
        )}

      </SafeAreaView>
    </View>
  );
}