import React, { useState, useEffect } from "react"; // 1. Добавили useEffect
import { View, FlatList, TouchableOpacity, Image, ActivityIndicator, Text, Keyboard, Alert } from "react-native";
import styled from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native"; // 2. Добавили useRoute
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios"; 
import api from "../src/api/client"; 

import InputField from "../components/Input_field";

// ... (Стили оставляем без изменений)
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
  const route = useRoute(); // Получаем доступ к параметрам навигации
  
  // Если пришли со сканера, берем код из параметров
  const initialQuery = route.params?.initialQuery || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 3. Эффект для автоматического поиска при открытии экрана
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  // Изменили функцию, чтобы она могла принимать аргумент напрямую
  const handleSearch = async (searchQuery = query) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;
    
    Keyboard.dismiss();
    setLoading(true);
    setResults([]); 
    
    try {
      const [localResponse, googleResponse] = await Promise.allSettled([
        api.get(`/api/literature/search?q=${finalQuery}`),
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${finalQuery}&maxResults=10`)
      ]);

      let combinedResults = [];

      if (localResponse.status === 'fulfilled') {
        const localBooks = localResponse.value.data.map(book => ({
          id: `local_${book.id}`,
          originalId: book.id,
          title: book.title,
          author: book.author,
          year: book.year,
          cover: book.cover_url,
          source: 'local'
        }));
        combinedResults = [...combinedResults, ...localBooks];
      }

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

      // 4. ЛОГИКА ПЕРЕХОДА: Если ничего не нашли и это был поиск по ISBN (цифры)
      if (combinedResults.length === 0 && /^\d+$/.test(finalQuery)) {
        Alert.alert(
          "Книга не найдена",
          "В базах нет книги с таким штрихкодом. Добавить её вручную?",
          [
            { text: "Отмена", style: "cancel" },
            { 
              text: "Да", 
              onPress: () => navigation.navigate("BookManualAdd", { book: { isbn: finalQuery } }) 
            }
          ]
        );
      }

    } catch (error) {
      console.error("Ошибка поиска:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book) => {
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

        <SearchRow>
          <View style={{ flex: 1 }}>
            <InputField 
              placeholder="Название или автор..." 
              value={query}
              onChangeText={setQuery}
              style={{ width: 'auto', marginHorizontal: 0 }}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch()} 
            />
          </View>

          <SearchButton onPress={() => handleSearch()}>
            <Image 
              source={require("../assets/search.png")} 
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
                isLocal={item.source === 'local'}
              >
                {item.cover ? (
                  <BookCover source={
                    item.cover.startsWith('http') 
                    ? { uri: item.cover } 
                    : { uri: `${api.defaults.baseURL}${item.cover}` }
                  } resizeMode="cover" />
                ) : (
                  <BookCover source={require("../assets/default_cover_book.png")} resizeMode="cover" />
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