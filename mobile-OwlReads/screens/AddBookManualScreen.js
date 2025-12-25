import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Text, Alert, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";

// Импорт твоих компонентов
import InputField from "../components/Input_field";
import RedButton from "../components/Red_button";
import BackgroundPaper from "../components/Background_paper";
import api from "../src/api/client";

// --- СТИЛИ ---

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

const CoverContainer = styled.TouchableOpacity`
  width: 140px;
  height: 200px;
  background-color: #E8DFC9;
  border-radius: 10px;
  align-self: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #890524;
  border-style: dashed;
  overflow: hidden;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const AddCoverText = styled.Text`
  font-family: "Inter-Regular";
  color: #890524;
  text-align: center;
  font-size: 14px;
  margin-top: 5px;
`;

const SectionTitle = styled.Text`
  font-family: "VollkornSC-Bold";
  font-size: 18px;
  color: #2F2017;
  margin-left: 32px;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const CategoriesContainer = styled.ScrollView`
  padding-left: 32px;
  margin-bottom: 20px;
`;

const CategoryChip = styled.TouchableOpacity`
  padding-vertical: 8px;
  padding-horizontal: 16px;
  background-color: ${(props) => (props.selected ? "#890524" : "#E8DFC9")};
  border-radius: 20px;
  margin-right: 10px;
  border-width: 1px;
  border-color: ${(props) => (props.selected ? "#890524" : "transparent")};
`;

const CategoryText = styled.Text`
  font-family: "Inter-Medium";
  color: ${(props) => (props.selected ? "#FDF5E2" : "#2F2017")};
  font-size: 14px;
`;

const FormContainer = styled.View`
  gap: 15px;
  margin-bottom: 30px;
`;

// --- КОМПОНЕНТ ---

export default function AddBookManualScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);

  // 1. Получаем данные, если пришли с экрана поиска
  const prefilledBook = route.params?.book;

  // 2. Инициализация состояний (если есть данные - подставляем, иначе пусто)
  const [title, setTitle] = useState(prefilledBook?.title || "");
  const [author, setAuthor] = useState(prefilledBook?.author || "");
  const [pages, setPages] = useState(prefilledBook?.pages ? String(prefilledBook.pages) : "");
  const [year, setYear] = useState(prefilledBook?.year ? String(prefilledBook.year) : "");
  const [language, setLanguage] = useState(prefilledBook?.language || "");
  const [description, setDescription] = useState(prefilledBook?.description || "");
  
  // Категории
  const categories = ["Читаю", "Хочу прочитать", "Прочитано", "Брошено", "Любимые"];
  const [selectedCategory, setSelectedCategory] = useState("");

  // Обложка
  const [coverUri, setCoverUri] = useState(prefilledBook?.cover || null);

  // Ошибки
  const [errors, setErrors] = useState({});

  // --- Выбор фото из галереи ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3], // Пропорции книги
      quality: 0.5,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

  // --- Сохранение книги ---
  const handleSave = async () => {
    let newErrors = {};
    let valid = true;

    // Валидация
    if (!title.trim()) {
      newErrors.title = "Введите название книги*";
      valid = false;
    }
    if (!author.trim()) {
      newErrors.author = "Введите автора*";
      valid = false;
    }
    if (!selectedCategory) {
      Alert.alert("Ошибка", "Пожалуйста, выберите категорию");
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);
    try {
      // Получаем ID пользователя
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert("Ошибка", "Пользователь не авторизован. Пожалуйста, войдите снова.");
        navigation.navigate("Entry");
        return;
      }

      // Подготовка данных для бэкенда
      const payload = {
        title: title,
        author: author,
        category_name: selectedCategory,
        pages: pages ? parseInt(pages) : null,
        year: year ? parseInt(year) : null,
        language: language,
        description: description,
        // Если ссылка внешняя (http) - отправляем. Если локальная (file://) - пока null.
        cover_url: coverUri && coverUri.startsWith('http') ? coverUri : null 
      };

      // Отправка запроса
      await api.post(`/api/users_book_review/manual?user_id=${userId}`, payload);

      Alert.alert("Успех", "Книга добавлена в вашу библиотеку!", [
        { text: "OK", onPress: () => navigation.navigate("Library") }
      ]);

    } catch (error) {
      console.error("Ошибка сохранения:", error);
      Alert.alert("Ошибка", "Не удалось сохранить книгу. Проверьте соединение.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      
      <SafeAreaView style={{ flex: 1 }}>
        {/* Хедер */}
        <Header>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35 }}>
            <Image 
              source={require("../assets/chevron_left.png")} 
              style={{ width: 35, height: 35 }} 
              resizeMode="contain" 
            />
          </TouchableOpacity>

          <OwlReadsTitle>OwlReads</OwlReadsTitle>

          <TouchableOpacity onPress={() => {}} style={{ width: 35, height: 35 }}>
            <Image 
              source={require("../assets/more.png")} 
              style={{ width: 35, height: 35 }} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        </Header>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Обложка */}
          <CoverContainer onPress={pickImage}>
            {coverUri ? (
              <CoverImage source={{ uri: coverUri }} resizeMode="cover" />
            ) : (
              <View style={{ alignItems: 'center', gap: 5 }}>
                 <Image 
                   source={require("../assets/add_book.png")} 
                   style={{ width: 40, height: 40, tintColor: '#890524' }} 
                   resizeMode="contain"
                 />
                 <AddCoverText>Добавить{"\n"}обложку</AddCoverText>
              </View>
            )}
          </CoverContainer>

          {/* Обязательные поля */}
          <FormContainer>
            <InputField 
              placeholder="Название книги" 
              value={title} 
              onChangeText={(t) => {setTitle(t); setErrors(prev => ({...prev, title: ""}))}}
              error={errors.title}
              style={{ width: 'auto' }} // Фикс ширины
            />
            <InputField 
              placeholder="Автор" 
              value={author} 
              onChangeText={(t) => {setAuthor(t); setErrors(prev => ({...prev, author: ""}))}}
              error={errors.author}
              style={{ width: 'auto' }} // Фикс ширины
            />
          </FormContainer>

          {/* Категории */}
          <SectionTitle>Категория*</SectionTitle>
          <CategoriesContainer horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <CategoryChip 
                key={cat} 
                selected={selectedCategory === cat} 
                onPress={() => setSelectedCategory(cat)}
              >
                <CategoryText selected={selectedCategory === cat}>{cat}</CategoryText>
              </CategoryChip>
            ))}
          </CategoriesContainer>

          {/* Дополнительные поля */}
          <SectionTitle>Дополнительно</SectionTitle>
          <FormContainer>
            <InputField 
              placeholder="Количество страниц" 
              value={pages} 
              onChangeText={setPages} 
              keyboardType="numeric"
              style={{ width: 'auto' }}
            />
            <InputField 
              placeholder="Год публикации" 
              value={year} 
              onChangeText={setYear} 
              keyboardType="numeric"
              style={{ width: 'auto' }}
            />
            <InputField 
              placeholder="Язык произведения" 
              value={language} 
              onChangeText={setLanguage} 
              style={{ width: 'auto' }}
            />
            <InputField 
              placeholder="Аннотация" 
              value={description} 
              onChangeText={setDescription} 
              style={{ width: 'auto' }}
              multiline={true}
            />
          </FormContainer>

          {/* Кнопка сохранения */}
          <View style={{ marginTop: 10 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#890524" />
            ) : (
              <RedButton 
                name="Сохранить" 
                onPress={handleSave} 
                style={{ width: 'auto' }} // Фикс ширины
              />
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}