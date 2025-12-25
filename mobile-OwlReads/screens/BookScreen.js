import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, Image, TouchableWithoutFeedback, ScrollView, TextInput, ActivityIndicator, Alert, Text } from "react-native";
import styled from "styled-components/native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

// Твой настроенный клиент API
import api from "../src/api/client";

import { TabBar } from "../components/Tab_bar";
import { TextBoxCategory } from "../components/TextBox_category";
import { TextBox } from "../components/TextBox_props";
import RedButton from "../components/Red_button";
import RatingStars from "../components/Rating_starts";
import QuoteBlock from "../components/Quote_block";
import NoteBlock from "../components/Note_block";

const OwlReadsTitle = styled.Text`
  color: #230109;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  font-weight: 400;
  text-align: center;
`;

const MenuContainer = styled.View`
  position: absolute;
  top: 40px;
  right: 0px;
  background-color: #fdf5e2;
  border-radius: 8px;
  padding-vertical: 5px;
  padding-left: 15px;
  padding-right: 40px;
  elevation: 6;
  z-index: 10;
  shadow-color: #230109;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

const MenuItem = styled(TouchableOpacity)`
  padding-vertical: 8px;
`;

const MenuTextDelete = styled.Text`
  font-family: "Inter-Regular";
  font-size: 14px;
  color: #2F2017;
`;

const ScreenTitle = styled.Text`
  color: #890524;
  font-family: "VollkornSC-Regular";
  font-size: 27px;
  text-align: center;
  margin-top: 20px;
`;

const CardContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-horizontal: 20px;
  border-radius: 20px;
  padding: 12px;
`;

const CoverImage = styled.Image`
  height: 160px;
  width: 110px;
  border-radius: 7px;
  background-color: #e0e0e0;
`;

const InfoBlock = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 10px;
`;

const LabelText = styled.Text`
  font-family: Inter-SemiBold;
  font-size: 14px;
  color: #890524;
  margin-top: 6px;
`;

const ValueText = styled.Text`
  font-family: Inter-Regular;
  font-size: 15px;
  color: #2F2017;
  margin-top: 2px;
`;

const BlockReview = styled.View`
  margin-horizontal: 20px;
  margin-bottom: 20px;
  border-radius: 20px;
  border-width: 2px;
  border-color: #a28c75;
  padding-horizontal: 10px;
  padding-vertical: 15px;
`;

export default function BookScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { reviewId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [bookData, setBookData] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuVisibleCategory, setMenuVisibleCategory] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genreMenuVisible, setGenreMenuVisible] = useState(false);
  const [category, setCategory] = useState("Прочитано");

  const [quoteNoteMenuVisible, setQuoteNoteMenuVisible] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [isQuoteMode, setIsQuoteMode] = useState(true);
  const [entries, setEntries] = useState([]);

  const [ratings, setRatings] = useState({
    Общая: 0,
    Персонажи: 0,
    Сюжет: 0,
    "Химия между персонажами": 0,
    Эмоциональность: 0,
    Концовка: 0,
    "Легкость чтения": 0,
  });
  const [ratingMenuVisible, setRatingMenuVisible] = useState(false);

  const ratingImages = {
    Общая: { filled: require("../assets/star_filled.png"), empty: require("../assets/star_empty.png") },
    Персонажи: { filled: require("../assets/diamond_filled.png"), empty: require("../assets/diamond_empty.png") },
    Сюжет: { filled: require("../assets/fire_filled.png"), empty: require("../assets/fire_empty.png") },
    "Химия между персонажами": { filled: require("../assets/heart_filled.png"), empty: require("../assets/heart_empty.png") },
    Эмоциональность: { filled: require("../assets/emoji_filled.png"), empty: require("../assets/emoji_empty.png") },
    Концовка: { filled: require("../assets/moon_filled.png"), empty: require("../assets/moon_empty.png") },
    "Легкость чтения": { filled: require("../assets/thunder_filled.png"), empty: require("../assets/thunder_empty.png") },
  };

  const fetchBookDetails = async () => {
    if (!reviewId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Путь /api/users_book_review/{id}
      const response = await api.get(`/api/users_book_review/${reviewId}`);
      const data = response.data;

      setBookData(data);
      setCategory(data.category_name);

      if (data.genres) {
        setGenres(data.genres.map((g) => g.name));
      }

      if (data.rating) {
        setRatings({
          Общая: data.rating.total_rating || 0,
          Персонажи: data.rating.characters_rating || 0,
          Сюжет: data.rating.plot_rating || 0,
          "Химия между персонажами": data.rating.relations_rating || 0,
          Эмоциональность: data.rating.emotionality_rating || 0,
          Концовка: data.rating.ending_rating || 0,
          "Легкость чтения": data.rating.easy_reading_rating || 0,
        });
      }

      const mappedQuotes = data.quotes.map(q => ({ type: "quote", text: q.text, author: q.quote_author, id: q.id }));
      const mappedNotes = data.notes.map(n => ({ type: "note", text: n.text, id: n.id }));
      setEntries([...mappedQuotes, ...mappedNotes]);

    } catch (error) {
      console.error("Ошибка при загрузке книги:", error);
      Alert.alert("Ошибка", "Не удалось загрузить данные о книге");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookDetails();
    }, [reviewId])
  );

  const handleDeleteBook = async () => {
    try {
      await api.delete(`/api/users_book_review/reviews/${reviewId}/`);
      setMenuVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Ошибка", "Не удалось удалить книгу");
    }
  };

  const handleSelectCategory = async (newCategory) => {
    try {
      // 1. Сразу обновляем UI, чтобы пользователь не ждал (оптимистичное обновление)
      setCategory(newCategory);
      setMenuVisibleCategory(false);

      // 2. Отправляем запрос на сервер
      await api.patch(`/api/users_book_review/reviews/${reviewId}/category`, {
        category_name: newCategory
      });

      console.log("Категория успешно обновлена на сервере");

    } catch (error) {
      console.error("Ошибка обновления категории:", error);
      Alert.alert("Ошибка", "Не удалось обновить категорию");
      // Если ошибка, можно вернуть старое значение, но пока оставим так
    }
  };

  const handleSaveEntry = async () => {
    try {
      if (isQuoteMode) {
        if (newQuoteText.trim()) {
          await api.post(`/api/users_book_quotes/`, {
            text: newQuoteText,
            quote_author: newQuoteAuthor,
            review_id: reviewId
          });
          setNewQuoteText("");
          setNewQuoteAuthor("");
        }
      } else {
        if (newNoteText.trim()) {
          await api.post(`/api/users_book_notes/`, {
            text: newNoteText,
            review_id: reviewId
          });
          setNewNoteText("");
        }
      }
      setQuoteNoteMenuVisible(false);
      fetchBookDetails();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      Alert.alert("Ошибка", "Не удалось сохранить");
    }
  };

  const handleSaveRating = async () => {
    try {
      // Мы просто отправляем POST запрос.
      // Благодаря изменениям на бэкенде, он сам поймет:
      // если рейтинг уже есть -> обновит его,
      // если нет -> создаст новый.
      await api.post(`/api/users_book_rating/`, {
        review_id: reviewId,
        total_rating: ratings["Общая"],
        characters_rating: ratings["Персонажи"],
        plot_rating: ratings["Сюжет"],
        relations_rating: ratings["Химия между персонажами"],
        emotionality_rating: ratings["Эмоциональность"],
        ending_rating: ratings["Концовка"],
        easy_reading_rating: ratings["Легкость чтения"]
      });

      // Обновляем данные на экране, чтобы увидеть изменения
      await fetchBookDetails();

      setRatingMenuVisible(false);
      Alert.alert("Успех", "Рейтинг сохранен!");
    } catch (error) {
      console.error(error);
      Alert.alert("Ошибка", "Не удалось сохранить рейтинг");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fdf5e2", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#890524" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => menuVisible && setMenuVisible(false)}>
      <View style={{ flex: 1, backgroundColor: "#fdf5e2" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 48, marginHorizontal: 23, position: "relative" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35 }}>
            <Image source={require("../assets/chevron_left.png")} style={{ width: 35, height: 35 }} resizeMode="contain" />
          </TouchableOpacity>

          <OwlReadsTitle>OwlReads</OwlReadsTitle>

          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={{ width: 35, height: 35 }}>
            <Image source={require("../assets/more.png")} style={{ width: 35, height: 35 }} resizeMode="contain" />
          </TouchableOpacity>

          {menuVisible && (
            <MenuContainer>
              <MenuItem onPress={handleDeleteBook}>
                <MenuTextDelete>Удалить книгу</MenuTextDelete>
              </MenuItem>
            </MenuContainer>
          )}
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <ScreenTitle>Книжный отзыв</ScreenTitle>

          <CardContainer>
            {bookData?.cover_url ? (
              <CoverImage source={{ uri: bookData.cover_url }} resizeMode="cover" />
            ) : (
              <CoverImage source={require("../assets/cover.png")} resizeMode="cover" />
            )}

            <InfoBlock>
              <LabelText>Название</LabelText>
              <ValueText style={{ fontFamily: "Inter-Bold" }}>{bookData?.title || "Без названия"}</ValueText>

              <LabelText>Автор</LabelText>
              <ValueText>{bookData?.author || "Неизвестно"}</ValueText>

              <LabelText>Количество страниц</LabelText>
              <ValueText>{bookData?.pages || "-"}</ValueText>

              <LabelText>Год публикации</LabelText>
              <ValueText>{bookData?.year || "-"}</ValueText>
            </InfoBlock>
          </CardContainer>

          <BlockReview style={{ gap: 8 }}>
            <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Аннотация</ValueText>
            <ValueText>{bookData?.description || "Описание отсутствует."}</ValueText>
          </BlockReview>

          <View style={{ marginHorizontal: 20, marginBottom: 20, gap: 8 }}>
            <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Категория</ValueText>
            <TouchableOpacity onPress={() => setMenuVisibleCategory(!menuVisibleCategory)}>
              <TextBoxCategory text={category} color="#AB66FF" />
            </TouchableOpacity>

            {menuVisibleCategory && (
              <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, borderWidth: 2, borderColor: "#a28c75", paddingVertical: 5, paddingHorizontal: 10, gap: 6 }}>
                {["Прочитано", "Читаю", "Хочу прочитать", "Брошено", "Любимые"].map((item) => (
                  <TouchableOpacity key={item} onPress={() => handleSelectCategory(item)}>
                    <ValueText>{item}</ValueText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <BlockReview>
            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={() => setGenreMenuVisible(true)}>
              <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Жанры</ValueText>
              <Image source={require("../assets/pencil.png")} style={{ width: 25, height: 25 }} resizeMode="contain" />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {genres.length > 0 ? (
                genres.map((g) => <TextBox key={g} text={g} color="#890524" />)
              ) : (
                <ValueText style={{ color: '#999', fontSize: 13 }}>Жанры не выбраны</ValueText>
              )}
            </View>
          </BlockReview>

          <BlockReview>
            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={() => setRatingMenuVisible(true)}>
              <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Оценка</ValueText>
              <Image source={require("../assets/pencil.png")} style={{ width: 25, height: 25 }} resizeMode="contain" />
            </TouchableOpacity>

            <View style={{ marginTop: 10, gap: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <ValueText>Общая</ValueText>
                <RatingStars rating={ratings["Общая"]} size={40} filledImage={require("../assets/star_filled.png")} emptyImage={require("../assets/star_empty.png")} />
              </View>
              {Object.entries(ratings).map(([key, value]) => {
                if (key === "Общая" || value === 0) return null;
                return (
                  <View key={key} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <ValueText style={{ flexShrink: 1, flexWrap: "wrap", fontSize: 12 }}>{key}</ValueText>
                    <RatingStars rating={value} size={35} filledImage={ratingImages[key].filled} emptyImage={ratingImages[key].empty} />
                  </View>
                );
              })}
            </View>
          </BlockReview>

          <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12, textAlign: "center", marginVertical: 10 }}>Цитаты / Заметки</ValueText>

          <BlockReview style={{ paddingVertical: 12 }}>
            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={() => { setIsQuoteMode(true); setQuoteNoteMenuVisible(true); }}>
              <ValueText style={{ fontSize: 13 }}>Добавить цитату / заметку</ValueText>
              <Image source={require("../assets/pencil.png")} style={{ width: 25, height: 25 }} resizeMode="contain" />
            </TouchableOpacity>
          </BlockReview>

          {entries.map((entry, index) => {
            if (entry.type === "quote") {
              return (
                <QuoteBlock
                  key={`quote-${entry.id || index}`}
                  text={entry.text}
                  author={entry.author}
                  onEdit={() => console.log("Редактировать цитату", entry.id)}
                  onDelete={async () => {
                    try {
                      // Удаляем с сервера
                      await api.delete(`/api/users_book_quotes/${entry.id}/`);
                      // Удаляем из локального стейта
                      setEntries(entries.filter((_, i) => i !== index));
                    } catch (error) {
                      console.error("Ошибка удаления цитаты:", error);
                      Alert.alert("Ошибка", "Не удалось удалить цитату");
                    }
                  }}
                />
              );
            }
            if (entry.type === "note") {
              return (
                <NoteBlock
                  key={`note-${entry.id || index}`}
                  text={entry.text}
                  onEdit={() => console.log("Редактировать заметку", entry.id)}
                  onDelete={async () => {
                    try {
                      // Удаляем с сервера
                      await api.delete(`/api/users_book_notes/${entry.id}/`);
                      // Удаляем из локального стейта
                      setEntries(entries.filter((_, i) => i !== index));
                    } catch (error) {
                      console.error("Ошибка удаления заметки:", error);
                      Alert.alert("Ошибка", "Не удалось удалить заметку");
                    }
                  }}
                />
              );
            }
            return null;
          })}
        </ScrollView>

        {/* --- Модалка жанров --- */}
        {genreMenuVisible && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 }}>
            <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, padding: 20, width: "100%", maxHeight: "70%" }}>
              <ScrollView>
                {["Young adult", "Античная литература", "Белорусская литература", "Биография, мемуары", "Бизнес-книги", "Боевик", "Детектив", "Детская литература", "Журнал, газета, статья", "Зарубежная литература", "Здоровье, медицина", "Историческая литература", "Комедия", "Комикс, манга, манхва, вебтун", "Культура, искусство", "Мифы, легенды, эпос", "На иностранном языке", "Научно-популярная литература", "Научная фантастика", "Нон-фикшн", "Приключения", "Психология", "Пьеса", "Религия", "Роман", "Русская классика", "Стихи, поэзия", "Техническая литература", "Триллер", "Ужасы, мистика", "Учебная литература", "Фантастика", "Философия", "Фэнтези", "Энциклопедия, справочник", "18+"].map((item) => (
                  <TouchableOpacity key={item} onPress={() => genres.includes(item) ? setGenres(genres.filter((g) => g !== item)) : setGenres([...genres, item])} style={{ paddingVertical: 8 }}>
                    <ValueText style={{ color: genres.includes(item) ? "#890524" : "#2F2017", fontFamily: genres.includes(item) ? "Inter-Bold" : "Inter-Regular" }}>{item}</ValueText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <RedButton
              name="Сохранить"
              onPress={async () => {
                try {
                  // Отправляем массив выбранных жанров на сервер
                  await api.put(`/api/users_book_review/reviews/${reviewId}/genres`, {
                    genres: genres // массив строк ["Фэнтези", "Детектив"]
                  });

                  setGenreMenuVisible(false);
                  Alert.alert("Успех", "Жанры обновлены!");

                  // Обновляем данные на экране (чтобы убедиться, что всё сохранилось)
                  fetchBookDetails();

                } catch (error) {
                  console.error("Ошибка обновления жанров:", error);
                  Alert.alert("Ошибка", "Не удалось сохранить жанры");
                }
              }}
            />
          </View>
        )}

        {/* --- Модалка рейтинга --- */}
        {ratingMenuVisible && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 }}>
            <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, padding: 20, width: "100%", maxHeight: "70%" }}>
              <ScrollView>
                {Object.keys(ratings).map((key) => (
                  <View key={key} style={{ marginBottom: 20 }}>
                    <ValueText style={{ marginBottom: 6 }}>{key}</ValueText>
                    <RatingStars rating={ratings[key]} size={50} filledImage={ratingImages[key].filled} emptyImage={ratingImages[key].empty} onRate={(newRating) => setRatings({ ...ratings, [key]: newRating })} />
                  </View>
                ))}
              </ScrollView>
            </View>
            <RedButton name="Сохранить" onPress={handleSaveRating} />
          </View>
        )}

        {/* --- Модалка цитат/заметок --- */}
        {quoteNoteMenuVisible && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 }}>
            <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, padding: 20, width: "100%", maxHeight: "70%" }}>
              <ScrollView>
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
                  <TouchableOpacity onPress={() => setIsQuoteMode(true)}><ValueText style={{ fontFamily: isQuoteMode ? "Inter-Bold" : "Inter-Regular", color: isQuoteMode ? "#890524" : "#2F2017" }}>Цитата</ValueText></TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsQuoteMode(false)}><ValueText style={{ fontFamily: !isQuoteMode ? "Inter-Bold" : "Inter-Regular", color: !isQuoteMode ? "#890524" : "#2F2017" }}>Заметка</ValueText></TouchableOpacity>
                </View>
                {isQuoteMode ? (
                  <>
                    <ValueText style={{ marginBottom: 6 }}>Текст цитаты</ValueText>
                    <TextInput style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 8, marginBottom: 12 }} multiline value={newQuoteText} onChangeText={setNewQuoteText} placeholder="Введите цитату..." />
                    <ValueText style={{ marginBottom: 6 }}>Автор</ValueText>
                    <TextInput style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 8, marginBottom: 12 }} value={newQuoteAuthor} onChangeText={setNewQuoteAuthor} placeholder="Введите автора..." />
                  </>
                ) : (
                  <>
                    <ValueText style={{ marginBottom: 6 }}>Текст заметки</ValueText>
                    <TextInput style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 8, marginBottom: 12 }} multiline value={newNoteText} onChangeText={setNewNoteText} placeholder="Введите заметку..." />
                  </>
                )}
              </ScrollView>
            </View>
            <RedButton name="Сохранить" onPress={handleSaveEntry} />
          </View>
        )}

        <TabBar color={"#fdf5e2"} />
      </View>
    </TouchableWithoutFeedback>
  );
}