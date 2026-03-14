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

const emojiMap = {
  excitement: require("../assets/emojie/excitement.png"),
  thank: require("../assets/emojie/thank.png"),
  inspiration: require("../assets/emojie/inspiration.png"),
  disturbance: require("../assets/emojie/disturbance.png"),
  delight: require("../assets/emojie/delight.png"),
  anger: require("../assets/emojie/anger.png"),
  pride: require("../assets/emojie/pride.png"),
  melancholy: require("../assets/emojie/melancholy.png"),
  pity: require("../assets/emojie/pity.png"),
  envy: require("../assets/emojie/envy.png"),
  amazement: require("../assets/emojie/amazement.png"),
  interest: require("../assets/emojie/interest.png"),
  comfort: require("../assets/emojie/comfort.png"),
  love: require("../assets/emojie/love.png"),
  hope: require("../assets/emojie/hope.png"),
  voltage: require("../assets/emojie/voltage.png"),
  tenderness: require("../assets/emojie/tenderness.png"),
  nostalgia: require("../assets/emojie/nostalgia.png"),
  relief: require("../assets/emojie/relief.png"),
  disgust: require("../assets/emojie/disgust.png"),
  sadness: require("../assets/emojie/sadness.png"),
  irritation: require("../assets/emojie/irritation.png"),
  reflection: require("../assets/emojie/reflection.png"),
  disappointment: require("../assets/emojie/disappointment.png"),
  determination: require("../assets/emojie/determination.png"),
  boredom: require("../assets/emojie/boredom.png"),
  tears: require("../assets/emojie/tears.png"),
  laughter: require("../assets/emojie/laughter.png"),
  confusion: require("../assets/emojie/confusion.png"),
  empathy: require("../assets/emojie/empathy.png"),
  calmness: require("../assets/emojie/calmness.png"),
  passion: require("../assets/emojie/passion.png"),
  fear: require("../assets/emojie/fear.png"),
  shame: require("../assets/emojie/shame.png"),
  anxiety: require("../assets/emojie/anxiety.png"),
  anticipation: require("../assets/emojie/anticipation.png"),
  horror: require("../assets/emojie/horror.png"),
  despondency: require("../assets/emojie/despondency.png"),
  shock: require("../assets/emojie/shock.png"),
  euphoria: require("../assets/emojie/euphoria.png"),
  rage: require("../assets/emojie/rage.png"),
};

const EmotionTag = ({ text, color, imageCode }) => {
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: hexToRgba(color, 0.2),
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 20,
      alignSelf: 'flex-start',
      gap: 6,
      marginBottom: 5
    }}>
      <Image
        source={emojiMap[imageCode]}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
      <Text style={{ color: color, fontFamily: 'Inter-Regular', fontSize: 12 }}>{text}</Text>
    </View>
  );
};

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
  const [categoryColor, setCategoryColor] = useState("#AB66FF");

  const [emotions, setEmotions] = useState([]); // Выбранные эмоции
  const [allEmotions, setAllEmotions] = useState([]); // Список всех эмоций для выбора
  const [emotionMenuVisible, setEmotionMenuVisible] = useState(false);


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
      setCategoryColor(data.category_color || "#AB66FF");

      if (data.genres) {
        setGenres(data.genres);
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

      if (data.emotions) {
        setEmotions(data.emotions);
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
      
      const fetchEmotionsList = async () => {
        try {
          const response = await api.get("/api/emotions/");
          setAllEmotions(response.data);
        } catch (error) {
          console.error("Ошибка при загрузке списка эмоций:", error);
        }
      };
      fetchEmotionsList();
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
      const response = await api.patch(`/api/users_book_review/reviews/${reviewId}/category`, {
        category_name: newCategory
      });

      if (response.data && response.data.category) {
        setCategory(response.data.category.name);
        setCategoryColor(response.data.category.color);
      }

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
              <CoverImage source={require("../assets/default_cover_book.png")} resizeMode="contain" />
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
              <TextBoxCategory text={category} color={categoryColor} />
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
            {genres.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {genres.map((g) => (<TextBox key={`display-${g.name}`} text={g.name} color={g.color || "#890524"} />
                ))}
              </View>
            )}
          </BlockReview>

          <BlockReview>
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              onPress={() => setEmotionMenuVisible(true)}
            >
              <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Эмоции от прочтения</ValueText>
              <Image source={require("../assets/pencil.png")} style={{ width: 25, height: 25 }} resizeMode="contain" />
            </TouchableOpacity>
            {emotions.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {emotions.map((e) => (
                  <EmotionTag
                    key={`display-emo-${e.id}`}
                    text={e.name}
                    color={e.color}
                    imageCode={e.image_code}
                  />
                ))}
              </View>
            )}
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

          {bookData?.isbn ? (
            <View style={{ marginTop: 10, marginBottom: 20, alignItems: "center", opacity: 0.5 }}>
              <Text style={{
                fontFamily: "Inter-Regular",
                fontSize: 10,
                color: "#2F2017"
              }}>
                ISBN: {bookData.isbn}
              </Text>
            </View>
          ) : null}
        </ScrollView>

        {/* --- Модалка жанров --- */}
        {genreMenuVisible && (
          <TouchableWithoutFeedback onPress={() => {
            setGenreMenuVisible(false);
            fetchBookDetails(); // Сбрасываем временные изменения, если не сохранили
          }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20, zIndex: 1000 }}>
              <TouchableWithoutFeedback onPress={() => { }}>
                {/* Пустой onPress нужен, чтобы клик по самой карточке не закрывал её */}
                <View style={{ width: "100%", alignItems: 'center' }}>
                  <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, padding: 20, width: "100%", maxHeight: "70%" }}>
                    <ScrollView>
                      {["Young adult", "Античная литература", "Белорусская литература", "Биография, мемуары", "Бизнес-книги", "Боевик", "Детектив", "Детская литература", "Журнал, газета, статья", "Зарубежная литература", "Здоровье, медицина", "Историческая литература", "Комедия", "Комикс, манга, манхва, вебтун", "Культура, искусство", "Мифы, легенды, эпос", "На иностранном языке", "Научно-популярная литература", "Научная фантастика", "Нон-фикшн", "Приключения", "Психология", "Пьеса", "Религия", "Роман", "Русская классика", "Стихи, поэзия", "Техническая литература", "Триллер", "Ужасы, мистика", "Учебная литература", "Фантастика", "Философия", "Фэнтези", "Энциклопедия, справочник", "18+"].map((item) => {
                        const isSelected = genres && genres.some(g => g.name === item);
                        return (
                          <TouchableOpacity
                            key={`modal-${item}`}
                            onPress={() => {
                              if (isSelected) {
                                setGenres(genres.filter((g) => g.name !== item));
                              } else {
                                setGenres([...genres, { name: item, color: "#890524" }]);
                              }
                            }}
                            style={{ paddingVertical: 8 }}
                          >
                            <ValueText style={{ color: isSelected ? "#890524" : "#2F2017", fontFamily: isSelected ? "Inter-Bold" : "Inter-Regular" }}>{item}</ValueText>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                  <View style={{ width: '100%', marginTop: 10 }}>
                    <RedButton
                      name="Сохранить"
                      onPress={async () => {
                        try {
                          const genreNamesToSend = genres.map(g => g.name);
                          await api.put(`/api/users_book_review/reviews/${reviewId}/genres`, { genres: genreNamesToSend });
                          setGenreMenuVisible(false);
                          Alert.alert("Успех", "Жанры обновлены!");
                          fetchBookDetails();
                        } catch (error) {
                          console.error(error);
                          Alert.alert("Ошибка", "Не удалось сохранить жанры");
                        }
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

        )}{/* --- Модалка жанров --- */}
        {genreMenuVisible && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
            {/* Слой 1: Прозрачный фон, который ловит клики для закрытия */}
            <TouchableWithoutFeedback onPress={() => {
              setGenreMenuVisible(false);
              fetchBookDetails();
            }}>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
            </TouchableWithoutFeedback>

            {/* Слой 2: Контент модалки (центрированный) */}
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }} pointerEvents="box-none">
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, padding: 20, width: "100%", maxHeight: "80%" }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {["Young adult", "Античная литература", "Белорусская литература", "Биография, мемуары", "Бизнес-книги", "Боевик", "Детектив", "Детская литература", "Журнал, газета, статья", "Зарубежная литература", "Здоровье, медицина", "Историческая литература", "Комедия", "Комикс, манга, манхва, вебтун", "Культура, искусство", "Мифы, легенды, эпос", "На иностранном языке", "Научно-популярная литература", "Научная фантастика", "Нон-фикшн", "Приключения", "Психология", "Пьеса", "Религия", "Роман", "Русская классика", "Стихи, поэзия", "Техническая литература", "Триллер", "Ужасы, мистика", "Учебная литература", "Фантастика", "Философия", "Фэнтези", "Энциклопедия, справочник", "18+"].map((item) => {
                      const isSelected = genres && genres.some(g => g.name === item);
                      return (
                        <TouchableOpacity
                          key={`modal-${item}`}
                          onPress={() => {
                            if (isSelected) {
                              setGenres(genres.filter((g) => g.name !== item));
                            } else {
                              setGenres([...genres, { name: item, color: "#890524" }]);
                            }
                          }}
                          style={{ paddingVertical: 10 }}
                        >
                          <ValueText style={{ color: isSelected ? "#890524" : "#2F2017", fontFamily: isSelected ? "Inter-Bold" : "Inter-Regular", fontSize: 16 }}>{item}</ValueText>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                  <View style={{ marginTop: 15 }}>
                    <RedButton
                      name="Сохранить"
                      onPress={async () => {
                        try {
                          const genreNamesToSend = genres.map(g => g.name);
                          await api.put(`/api/users_book_review/reviews/${reviewId}/genres`, { genres: genreNamesToSend });
                          setGenreMenuVisible(false);
                          fetchBookDetails();
                        } catch (error) {
                          console.error(error);
                          Alert.alert("Ошибка", "Не удалось сохранить жанры");
                        }
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {/* --- Модалка Эмоций --- */}
        {emotionMenuVisible && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100 }}>
            <TouchableWithoutFeedback onPress={() => { setEmotionMenuVisible(false); fetchBookDetails(); }}>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
            </TouchableWithoutFeedback>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }} pointerEvents="box-none">
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, padding: 20, width: "100%", maxHeight: "80%" }}>
                  <Text style={{ fontFamily: 'VollkornSC-Regular', fontSize: 20, color: '#890524', marginBottom: 15, textAlign: 'center' }}>Какие эмоции вызвала книга?</Text>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                      {allEmotions.map((item) => {
                        const isSelected = emotions.some(e => e.id === item.id);
                        return (
                          <TouchableOpacity
                            key={`modal-emo-${item.id}`}
                            onPress={() => {
                              if (isSelected) {
                                setEmotions(emotions.filter((e) => e.id !== item.id));
                              } else {
                                setEmotions([...emotions, item]);
                              }
                            }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 8,
                              borderRadius: 12,
                              borderWidth: 2,
                              borderColor: isSelected ? item.color : '#E8DFC9',
                              backgroundColor: isSelected ? `${item.color}25` : 'transparent',
                              gap: 5
                            }}
                          >
                            <Image source={emojiMap[item.image_code]} style={{ width: 25, height: 25 }} />
                            <Text style={{ color: '#2F2017', fontSize: 13, fontFamily: isSelected ? 'Inter-Bold' : 'Inter-Regular' }}>{item.name}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                  <View style={{ marginTop: 15 }}>
                    <RedButton
                      name="Сохранить"
                      onPress={async () => {
                        try {
                          const emotionNames = emotions.map(e => e.name);
                          await api.put(`/api/users_book_review/reviews/${reviewId}/emotions`, { emotions: emotionNames });
                          setEmotionMenuVisible(false);
                          fetchBookDetails();
                        } catch (error) {
                          Alert.alert("Ошибка", "Не удалось сохранить эмоции");
                        }
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {/* --- Модалка рейтинга --- */}
        {ratingMenuVisible && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
            <TouchableWithoutFeedback onPress={() => setRatingMenuVisible(false)}>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
            </TouchableWithoutFeedback>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }} pointerEvents="box-none">
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, padding: 20, width: "100%", maxHeight: "80%" }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {Object.keys(ratings).map((key) => (
                      <View key={key} style={{ marginBottom: 20 }}>
                        <ValueText style={{ marginBottom: 8, fontSize: 16 }}>{key}</ValueText>
                        <RatingStars
                          rating={ratings[key]}
                          size={45}
                          filledImage={ratingImages[key].filled}
                          emptyImage={ratingImages[key].empty}
                          onRate={(newRating) => setRatings({ ...ratings, [key]: newRating })}
                        />
                      </View>
                    ))}
                  </ScrollView>
                  <View style={{ marginTop: 10 }}>
                    <RedButton name="Сохранить" onPress={handleSaveRating} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {/* --- Модалка цитат/заметок --- */}
        {quoteNoteMenuVisible && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
            <TouchableWithoutFeedback onPress={() => setQuoteNoteMenuVisible(false)}>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
            </TouchableWithoutFeedback>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }} pointerEvents="box-none">
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: "#fdf5e2", borderRadius: 20, padding: 20, width: "100%", maxHeight: "80%" }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
                      <TouchableOpacity onPress={() => setIsQuoteMode(true)}>
                        <ValueText style={{ fontSize: 18, fontFamily: isQuoteMode ? "Inter-Bold" : "Inter-Regular", color: isQuoteMode ? "#890524" : "#2F2017" }}>Цитата</ValueText>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setIsQuoteMode(false)}>
                        <ValueText style={{ fontSize: 18, fontFamily: !isQuoteMode ? "Inter-Bold" : "Inter-Regular", color: !isQuoteMode ? "#890524" : "#2F2017" }}>Заметка</ValueText>
                      </TouchableOpacity>
                    </View>

                    {isQuoteMode ? (
                      <>
                        <ValueText style={{ marginBottom: 6 }}>Текст цитаты</ValueText>
                        <TextInput
                          style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 12, marginBottom: 15, color: '#2F2017', textAlignVertical: 'top', minHeight: 80 }}
                          multiline value={newQuoteText} onChangeText={setNewQuoteText} placeholder="Введите цитату..."
                        />
                        <ValueText style={{ marginBottom: 6 }}>Автор</ValueText>
                        <TextInput
                          style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 12, marginBottom: 10, color: '#2F2017' }}
                          value={newQuoteAuthor} onChangeText={setNewQuoteAuthor} placeholder="Введите автора..."
                        />
                      </>
                    ) : (
                      <>
                        <ValueText style={{ marginBottom: 6 }}>Текст заметки</ValueText>
                        <TextInput
                          style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 12, marginBottom: 15, color: '#2F2017', textAlignVertical: 'top', minHeight: 100 }}
                          multiline value={newNoteText} onChangeText={setNewNoteText} placeholder="Введите заметку..."
                        />
                      </>
                    )}
                  </ScrollView>
                  <View style={{ marginTop: 10 }}>
                    <RedButton name="Сохранить" onPress={handleSaveEntry} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        <TabBar color={"#fdf5e2"} />
      </View>
    </TouchableWithoutFeedback>
  );
}