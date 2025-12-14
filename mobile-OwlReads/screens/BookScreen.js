// screens/BookScreen.js
import React, { useState } from "react";
import { View, TouchableOpacity, Image, TouchableWithoutFeedback, ScrollView, TextInput } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
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
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuVisibleCategory, setMenuVisibleCategory] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genreMenuVisible, setGenreMenuVisible] = useState(false);

  const navigation = useNavigation();

  const [category, setCategory] = useState("Прочитано");

  const [quoteNoteMenuVisible, setQuoteNoteMenuVisible] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [isQuoteMode, setIsQuoteMode] = useState(true);
  const [entries, setEntries] = useState([]);

  const ratingImages = {
    Общая: {
      filled: require("../assets/star_filled.png"),
      empty: require("../assets/star_empty.png"),
    },
    Персонажи: {
      filled: require("../assets/diamond_filled.png"),
      empty: require("../assets/diamond_empty.png"),
    },
    Сюжет: {
      filled: require("../assets/fire_filled.png"),
      empty: require("../assets/fire_empty.png"),
    },
    "Химия между персонажами": {
      filled: require("../assets/heart_filled.png"),
      empty: require("../assets/heart_empty.png"),
    },
    Эмоциональность: {
      filled: require("../assets/emoji_filled.png"),
      empty: require("../assets/emoji_empty.png"),
    },
    Концовка: {
      filled: require("../assets/moon_filled.png"),
      empty: require("../assets/moon_empty.png"),
    },
    "Легкость чтения": {
      filled: require("../assets/thunder_filled.png"),
      empty: require("../assets/thunder_empty.png"),
    },
  };

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


  const handleDeleteBook = () => {
    console.log("Удалить книгу");
    setMenuVisible(false);
  };

  const handleSelectCategory = (newCategory) => {
    setCategory(newCategory);
    setMenuVisibleCategory(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => menuVisible && setMenuVisible(false)}>
      <View style={{ flex: 1, backgroundColor: "#fdf5e2" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 48,
            marginHorizontal: 23,
            position: "relative",
          }}
        >
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
            <CoverImage source={require("../assets/cover.png")} resizeMode="cover" />
            <InfoBlock>
              <LabelText>Название</LabelText>
              <ValueText style={{ fontFamily: "Inter-Bold" }}>Звездные войны: Старая Республика. Реван</ValueText>

              <LabelText>Автор</LabelText>
              <ValueText>Д. Карпишин</ValueText>

              <LabelText>Количество страниц</LabelText>
              <ValueText>384</ValueText>

              <LabelText>Год публикации</LabelText>
              <ValueText>2010</ValueText>
            </InfoBlock>
          </CardContainer>

          <BlockReview style={{ gap: 8 }}>
            <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Аннотация</ValueText>
            <ValueText>
              Безжалостное зло в скором времени сокрушит республику. Только опорочивший себя джедай, изгой, может остановить это. {"\n"}{"\n"}Реван - герой, ставший предателем, злодей и одновременно спаситель. Джедай, некогда покинувший Корусант, чтобы победить мандалорцев, поборник Тёмной стороны, вернувшийся для того, чтобы уничтожить Республику. Совет джедаев оставил Ревану жизнь, но ценой искупления стала его память. Всё, что у него осталось - это ночные кошмары и постоянный страх. {"\n"}Так что же случилось за пределами Внешнего кольца Галактики? Реван не может вспомнить, но не может и полностью забыть ужасную тайну, которая угрожает самому существованию Республики. Он не знает, что это, или как это остановить. Возможно, он падёт в этой борьбе, так как никогда ранее не встречал столь сильного и жестокого врага. Но только смерть может помешать бороться рыцарю-джедаю.
            </ValueText>
          </BlockReview>

          <View style={{ marginHorizontal: 20, marginBottom: 20, gap: 8 }}>
            <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Категория</ValueText>

            <TouchableOpacity onPress={() => setMenuVisibleCategory(!menuVisibleCategory)}>
              <TextBoxCategory text={category} color="#AB66FF" />
            </TouchableOpacity>

            {menuVisibleCategory && (
              <View
                style={{
                  backgroundColor: "#fdf5e2",
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#a28c75",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  gap: 6,
                }}
              >
                {["Прочитано", "Читаю", "Хочу прочитать", "Брошено", "Любимые"].map((item) => (
                  <TouchableOpacity key={item} onPress={() => handleSelectCategory(item)}>
                    <ValueText>{item}</ValueText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <BlockReview>
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              onPress={() => setGenreMenuVisible(true)}
            >
              <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Жанры</ValueText>
              <Image source={require("../assets/pencil.png")} style={{ width: 25, height: 25 }} resizeMode="contain" />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {genres.map((g) => (
                <TextBox key={g} text={g} color="#890524" />
              ))}
            </View>
          </BlockReview>

          <BlockReview>
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              onPress={() => setRatingMenuVisible(true)}
            >
              <ValueText style={{ fontFamily: "Inter-Bold", fontSize: 12 }}>Оценка</ValueText>
              <Image source={require("../assets/pencil.png")} style={{ width: 25, height: 25 }} resizeMode="contain" />
            </TouchableOpacity>

            <View style={{ marginTop: 10, gap: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <ValueText>Общая</ValueText>
                <RatingStars
                  rating={ratings["Общая"]}
                  size={40}
                  filledImage={require("../assets/star_filled.png")}
                  emptyImage={require("../assets/star_empty.png")}
                />
              </View>

              {Object.entries(ratings).map(([key, value]) => {
                if (key === "Общая" || value === 0) return null;
                return (
                  <View key={key} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <ValueText style={{ flexShrink: 1, flexWrap: "wrap", fontSize: 12 }}>{key}</ValueText>
                    <RatingStars
                      rating={value}
                      size={35}
                      filledImage={ratingImages[key].filled}
                      emptyImage={ratingImages[key].empty}
                    />
                  </View>
                );
              })}
            </View>
          </BlockReview>

          <ValueText
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 12,
              textAlign: "center",
              marginVertical: 10
            }}
          >
            Цитаты / Заметки
          </ValueText>

          <BlockReview style={{ paddingVertical: 12 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              onPress={() => {
                setIsQuoteMode(true);
                setQuoteNoteMenuVisible(true);
              }}
            >
              <ValueText style={{ fontSize: 13 }}>
                Добавить цитату / заметку
              </ValueText>
              <Image
                source={require("../assets/pencil.png")}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </BlockReview>

          {entries.map((entry, index) => {
            if (entry.type === "quote") {
              return (
                <QuoteBlock
                  key={`entry-${index}`}
                  text={entry.text}
                  author={entry.author}
                  onEdit={() => console.log("Редактировать цитату", index)}
                  onDelete={() => setEntries(entries.filter((_, i) => i !== index))}
                />
              );
            }
            if (entry.type === "note") {
              return (
                <NoteBlock
                  key={`entry-${index}`}
                  text={entry.text}
                  onEdit={() => console.log("Редактировать заметку", index)}
                  onDelete={() => setEntries(entries.filter((_, i) => i !== index))}
                />
              );
            }
          })}

        </ScrollView>

        {genreMenuVisible && (
          <View style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 10
          }}>
            <View style={{
              backgroundColor: "#fdf5e2",
              borderRadius: 20,
              padding: 20,
              width: "100%",
              maxHeight: "70%"
            }}>
              <ScrollView>
                {[
                  "Young adult", "Античная литература", "Белорусская литература", "Биография, мемуары", "Бизнес-книги", "Боевик",
                  "Детектив", "Детская литература", "Журнал, газета, статья", "Зарубежная литература", "Здоровье, медицина",
                  "Историческая литература", "Комедия", "Комикс, манга, манхва, вебтун", "Культура, искусство", "Мифы, легенды, эпос",
                  "На иностранном языке", "Научно-популярная литература", "Научная фантастика", "Нон-фикшн", "Приключения", "Психология",
                  "Пьеса", "Религия", "Роман", "Русская классика", "Стихи, поэзия", "Техническая литература", "Триллер", "Ужасы, мистика",
                  "Учебная литература", "Фантастика", "Философия", "Фэнтези", "Энциклопедия, справочник", "18+"
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      if (genres.includes(item)) {
                        setGenres(genres.filter((g) => g !== item));
                      } else {
                        setGenres([...genres, item]);
                      }
                    }}
                    style={{ paddingVertical: 8 }}
                  >
                    <ValueText style={{
                      color: genres.includes(item) ? "#890524" : "#2F2017",
                      fontFamily: genres.includes(item) ? "Inter-Bold" : "Inter-Regular"
                    }}>
                      {item}
                    </ValueText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <RedButton name="Сохранить" onPress={() => setGenreMenuVisible(false)} />
          </View>
        )}

        {ratingMenuVisible && (
          <View style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 10
          }}>
            <View style={{
              backgroundColor: "#fdf5e2",
              borderRadius: 20,
              padding: 20,
              width: "100%",
              maxHeight: "70%"
            }}>
              <ScrollView>
                {Object.keys(ratings).map((key) => (
                  <View key={key} style={{ marginBottom: 20 }}>
                    <ValueText style={{ marginBottom: 6 }}>{key}</ValueText>
                    <RatingStars
                      rating={ratings[key]}
                      size={50}
                      filledImage={ratingImages[key].filled}
                      emptyImage={ratingImages[key].empty}
                      onRate={(newRating) => setRatings({ ...ratings, [key]: newRating })}
                    />
                  </View>

                ))}
              </ScrollView>
            </View>
            <RedButton name="Сохранить" onPress={() => setRatingMenuVisible(false)} />
          </View>
        )}


        {quoteNoteMenuVisible && (
          <View style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 10
          }}>
            <View style={{
              backgroundColor: "#fdf5e2",
              borderRadius: 20,
              padding: 20,
              width: "100%",
              maxHeight: "70%"
            }}>
              <ScrollView>

                <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
                  <TouchableOpacity onPress={() => setIsQuoteMode(true)}>
                    <ValueText style={{
                      fontFamily: isQuoteMode ? "Inter-Bold" : "Inter-Regular",
                      color: isQuoteMode ? "#890524" : "#2F2017",
                    }}
                    >
                      Цитата
                    </ValueText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsQuoteMode(false)}>
                    <ValueText style={{
                      fontFamily: !isQuoteMode ? "Inter-Bold" : "Inter-Regular",
                      color: !isQuoteMode ? "#890524" : "#2F2017",
                    }}
                    >
                      Заметка
                    </ValueText>
                  </TouchableOpacity>
                </View>

                {isQuoteMode ? (
                  <>
                    <ValueText style={{ marginBottom: 6 }}>Текст цитаты</ValueText>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 8, marginBottom: 12 }}
                      multiline
                      value={newQuoteText}
                      onChangeText={setNewQuoteText}
                      placeholder="Введите цитату..."
                    />

                    <ValueText style={{ marginBottom: 6 }}>Автор</ValueText>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 8, marginBottom: 12 }}
                      value={newQuoteAuthor}
                      onChangeText={setNewQuoteAuthor}
                      placeholder="Введите автора..."
                    />
                  </>
                ) : (
                  <>
                    <ValueText style={{ marginBottom: 6 }}>Текст заметки</ValueText>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: "#a28c75", borderRadius: 8, padding: 8, marginBottom: 12 }}
                      multiline
                      value={newNoteText}
                      onChangeText={setNewNoteText}
                      placeholder="Введите заметку..."
                    />
                  </>
                )}
              </ScrollView>
            </View>
            <RedButton
              name="Сохранить"
              onPress={() => {
                if (isQuoteMode) {
                  if (newQuoteText.trim() && newQuoteAuthor.trim()) {
                    setEntries([...entries, { type: "quote", text: newQuoteText, author: newQuoteAuthor }]);
                    setNewQuoteText("");
                    setNewQuoteAuthor("");
                  }
                } else {
                  if (newNoteText.trim()) {
                    setEntries([...entries, { type: "note", text: newNoteText }]);
                    setNewNoteText("");
                  }
                }
                setQuoteNoteMenuVisible(false);
              }}
            />


          </View>
        )}


        <TabBar color={"#fdf5e2"} />
      </View>
    </TouchableWithoutFeedback>
  );
}
