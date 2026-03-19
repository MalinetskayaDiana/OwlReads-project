import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, Text, Alert, ActivityIndicator, LayoutAnimation, Platform, UIManager } from "react-native";
import styled from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import InputField from "../components/Input_field";
import RedButton from "../components/Red_button";
import api from "../src/api/client";

// Включаем анимацию для Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

const LabelText = styled.Text`
  font-family: "Inter-Medium";
  font-size: 12px;
  color: #A28C75;
  margin-left: 4px;
  margin-bottom: 4px;
`;

const CategoriesContainer = styled.ScrollView`
  padding-left: 32px;
  margin-bottom: 20px;
`;

const CategoryChip = styled.TouchableOpacity`
  padding-vertical: 8px;
  padding-horizontal: 16px;
  border-radius: 20px;
  margin-right: 10px;
  background-color: ${props => props.selected ? hexToRgba(props.activeColor, 0.2) : "#E8DFC9"};
`;

const CategoryText = styled.Text`
  font-family: "Inter-Medium";
  color: ${props => props.selected ? props.activeColor : "#2F2017"};
  font-size: 14px;
`;

const FormContainer = styled.View`
  gap: 12px;
  margin-bottom: 20px;
  padding-horizontal: 32px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
`;

const ScanGradient = styled(LinearGradient)`
  width: 45px;
  height: 43px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  elevation: 3;
`;

// Стили для выпадающего списка (Accordion)
const DropdownContainer = styled.View`
  background-color: #E8DFC9;
  border-radius: 14px;
  overflow: hidden;
  margin-horizontal: 32px;
  margin-bottom: 20px;
`;

const DropdownHeader = styled.TouchableOpacity`
  height: 43px;
  padding-horizontal: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DropdownList = styled.View`
  background-color: rgba(232, 223, 201, 0.5);
`;

const DropdownItem = styled.TouchableOpacity`
  padding: 12px 16px;
  border-top-width: 1px;
  border-top-color: rgba(162, 140, 117, 0.2);
`;

// --- КОМПОНЕНТ ---

export default function AddBookManualScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);

  const prefilledBook = route.params?.book;

  // Состояния полей
  const [title, setTitle] = useState(prefilledBook?.title || "");
  const [author, setAuthor] = useState(prefilledBook?.author || "");
  const [pages, setPages] = useState(prefilledBook?.pages ? String(prefilledBook.pages) : "");
  const [year, setYear] = useState(prefilledBook?.year ? String(prefilledBook.year) : "");
  const [language, setLanguage] = useState(prefilledBook?.language || "");
  const [description, setDescription] = useState(prefilledBook?.description || "");
  const [isbn, setIsbn] = useState(prefilledBook?.isbn || "");
  
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [bindingType, setBindingType] = useState("Не выбрано");
  const [isBindingOpen, setIsBindingOpen] = useState(false);
  const bindings = ["Твердый", "Мягкий", "Не выбрано"];

  const [coverUri, setCoverUri] = useState(prefilledBook?.cover || null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/books_categories/");
        setCategoriesList(response.data);
      } catch (e) { console.error(e); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (route.params?.scannedIsbn) {
      setIsbn(route.params.scannedIsbn);
    }
  }, [route.params?.scannedIsbn]);

  const toggleBinding = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsBindingOpen(!isBindingOpen);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.5,
    });
    if (!result.canceled) setCoverUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!title.trim() || !author.trim() || !selectedCategory) {
      Alert.alert("Ошибка", "Название, автор и категория обязательны");
      return;
    }
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('category_name', selectedCategory.name);
      formData.append('binding_type', bindingType);
      if (pages) formData.append('pages', pages);
      if (year) formData.append('year', year);
      if (language) formData.append('language', language);
      if (description) formData.append('description', description);
      if (isbn) formData.append('isbn', isbn);

      if (coverUri && !coverUri.startsWith('http')) {
        const filename = coverUri.split('/').pop();
        formData.append('cover_file', { uri: coverUri, name: filename, type: 'image/jpeg' });
      } else if (coverUri) {
        formData.append('cover_url', coverUri);
      }

      await api.post(`/api/users_book_review/manual?user_id=${userId}`, formData);
      navigation.navigate("Library");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить книгу.");
    } finally { setLoading(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require("../assets/chevron_left.png")} style={{ width: 35, height: 35 }} resizeMode="contain" />
          </TouchableOpacity>
          <OwlReadsTitle>OwlReads</OwlReadsTitle>
          <View style={{ width: 35 }} />
        </Header>

        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          
          <CoverContainer onPress={pickImage}>
            {coverUri ? (
              <CoverImage source={{ uri: coverUri }} resizeMode="cover" />
            ) : (
              <View style={{ alignItems: 'center', gap: 5 }}>
                 <Image source={require("../assets/Gallery.png")} style={{ width: 50, height: 50 }} resizeMode="contain" />
                 <AddCoverText>Добавить{"\n"}обложку</AddCoverText>
              </View>
            )}
          </CoverContainer>

          <FormContainer>
            <View>
              <LabelText>Название книги*</LabelText>
              <InputField placeholder="Введите название" value={title} onChangeText={setTitle} />
            </View>
            <View>
              <LabelText>Автор*</LabelText>
              <InputField placeholder="Введите автора" value={author} onChangeText={setAuthor} />
            </View>
          </FormContainer>

          <SectionTitle>Категория*</SectionTitle>
          <CategoriesContainer horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 32 }}>
            {categoriesList.map((cat) => (
              <CategoryChip 
                key={cat.id} 
                selected={selectedCategory?.id === cat.id} 
                activeColor={cat.color}
                onPress={() => setSelectedCategory(cat)}
              >
                <CategoryText selected={selectedCategory?.id === cat.id} activeColor={cat.color}>{cat.name}</CategoryText>
              </CategoryChip>
            ))}
          </CategoriesContainer>

          <SectionTitle>Вид переплета</SectionTitle>
          <DropdownContainer>
            <DropdownHeader onPress={toggleBinding}>
              <Text style={{ color: "#2F2017", fontFamily: "Inter-Regular" }}>{bindingType}</Text>
              <Image 
                source={require("../assets/chevron_down.png")} 
                style={{ 
                  width: 20, height: 20, tintColor: "#890524",
                  transform: [{ rotate: isBindingOpen ? '180deg' : '0deg' }] 
                }} 
              />
            </DropdownHeader>
            {isBindingOpen && (
              <DropdownList>
                {bindings.map((item) => (
                  <DropdownItem key={item} onPress={() => { setBindingType(item); toggleBinding(); }}>
                    <Text style={{ fontFamily: 'Inter-Regular', color: '#2F2017' }}>{item}</Text>
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownContainer>

          <SectionTitle>Дополнительно</SectionTitle>
          <FormContainer>
            <InputRow>
              <View style={{ flex: 1 }}>
                <LabelText>ISBN (Штрихкод)</LabelText>
                <InputField 
                  placeholder="0000000000000" 
                  value={isbn} 
                  onChangeText={setIsbn} 
                  keyboardType="numeric"
                  containerHeight={43}
                  fontSize={14}
                />
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("BarcodeScanner", { mode: "fill" })}>
                <ScanGradient colors={["#890524", "#230109"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                  <Image source={require("../assets/Qrcode.png")} style={{ width: 26, height: 26, tintColor: '#FDF5E2' }} />
                </ScanGradient>
              </TouchableOpacity>
            </InputRow>

            <View>
              <LabelText>Количество страниц</LabelText>
              <InputField placeholder="0" value={pages} onChangeText={setPages} keyboardType="numeric" containerHeight={43} fontSize={14} />
            </View>

            <View>
              <LabelText>Год публикации</LabelText>
              <InputField placeholder="2024" value={year} onChangeText={setYear} keyboardType="numeric" containerHeight={43} fontSize={14} />
            </View>

            <View>
              <LabelText>Язык произведения</LabelText>
              <InputField placeholder="Русский" value={language} onChangeText={setLanguage} containerHeight={43} fontSize={14} />
            </View>

            <View>
              <LabelText>Аннотация</LabelText>
              <InputField placeholder="О чем эта книга?" value={description} onChangeText={setDescription} multiline={true} fontSize={14} />
            </View>
          </FormContainer>

          <View style={{ marginHorizontal: 32, marginTop: 10 }}>
            {loading ? <ActivityIndicator size="large" color="#890524" /> : <RedButton name="Сохранить" onPress={handleSave} />}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}