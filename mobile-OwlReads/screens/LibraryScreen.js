// screens/LibraryScreen.js
import React, {useState} from "react";
import { View, FlatList, TouchableWithoutFeedback  } from "react-native";
import styled from "styled-components/native";
import NavigationBar from "../components/Navigation_bar";
import { BookCard } from "../components/Book_card";
import { TabBar } from "../components/Tab_bar";
import { TextBox } from "../components/TextBox_props";
import RatingStars from "../components/Rating_starts";
import RedButton from "../components/Red_button";

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
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book_active.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "Library" },
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user.png"), screen: "Account" },
  ];

  const books = [
    {
      id: "1",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
    {
      id: "2",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
    {
      id: "3",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
    {
      id: "4",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
    {
      id: "5",
      cover: require("../assets/cover.png"),
      category: "Прочитано",
      categorycolor: "#AB66FF",
      title: "Звездные войны: Старая Республика. Реван",
      author: "Д. Карпишин",
      rating: 5,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{ flexDirection: "column"}}>
        <OwlReadsTitle>
          OwlReads
        </OwlReadsTitle>
        <Separator />
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <BookCard
            cover={item.cover}
            category={item.category}
            categorycolor={item.categorycolor}
            title={item.title}
            author={item.author}
            rating={item.rating}
            onPress={() => {
                setSelectedBook(item);
                setOverlayVisible(true);
              }}
          />
        )}
          contentContainerStyle={{ paddingBottom: 260, paddingTop: 10 }}
        />
      </View>
      <NavigationBar icons={icons} />
      <TabBar color={"#D7C1AB"}/>

      {overlayVisible && selectedBook && (
        <TouchableWithoutFeedback onPress={() => setOverlayVisible(false)}>
          <Overlay>
            <Circle/>
            <OverlayContent>
                <OverlayCover source={selectedBook.cover} resizeMode="cover" />
                
                <View style={{ alignSelf: 'center' }}>
                  <TextBox text={selectedBook.category} color={selectedBook.categorycolor}/>
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
                <RedButton name={"Подробнее"} screen={"Book"}/>
            </OverlayContent>
          </Overlay>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
