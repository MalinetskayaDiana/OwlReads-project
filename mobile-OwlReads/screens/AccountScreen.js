import React, { useState, useCallback } from "react";
import { View, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Импорты компонентов
import NavigationBar from "../components/Navigation_bar";
import { TabBar } from "../components/Tab_bar";
import AddBookModal from "../components/Add_book_modal"; 
import api from "../src/api/client";

// --- STYLED COMPONENTS (Без изменений) ---
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

const UserContainer = styled.View`
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const MoreButton = styled(TouchableOpacity)`
  align-self: flex-end;
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

const MenuText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 14px;
  color: #2F2017;
`;

const MenuTextLogout = styled(MenuText)`
  color: #890524;
`;

const UserName = styled.Text`
  align-items: center;
  color: #890524;
  display: flex;
  font-family: "VollkornSC-Bold";
  font-size: 25px;
  justify-content: center;
  position: relative;
  text-align: center;
  margin-top: -10px;
`;

const UserEmail = styled.Text`
  align-items: center;
  align-self: stretch;
  color: #2F2017;
  display: flex;
  font-family: "Inter-Regular";
  font-size: 12px;
  justify-content: center;
  text-align: center;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding-horizontal: 12px;
  gap: 30px;
`;

const StatItem = styled.View`
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.Text`
  font-family: "Inter-Medium";
  font-size: 15px;
  color: #2F2017;
  text-align: center;
`;

const StatValue = styled.Text`
  font-family: "VollkornSC-Regular";
  font-size: 20px;
  color: #2F2017;
  text-align: center;
  margin-top: 4px;
`;

const TextLabel = styled.Text`
  font-family: "Inter-Medium";
  font-size: 13px;
  color: #2F2017;
  text-align: center;
`;

const ContainerText = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: 5px;
  padding-horizontal: 15px;
  border-radius: 20px;
  background-color: #A28C75;
`;

const StyledText = styled.Text`
  font-family: Inter-Regular;
  font-size: 15px;
  color: #FDF5E2;
`;

export default function AccountScreen() {
  const [menuVisible, setMenuVisible] = useState(false); // Меню профиля (три точки)
  const [isAddBookModalVisible, setAddBookModalVisible] = useState(false); // <--- 2. Состояние для меню добавления
  
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  const [userData, setUserData] = useState({
    username: "Загрузка...",
    email: "",
    profile_photo: null
  });

  const [userStats, setUserStats] = useState({
    books_in_library: 0,
    books_read: 0,
    books_favorites: 0,
    favorite_author: "-",
    favorite_genre: "-"
  });

  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "AddBookModal" }, // screen указывает на модалку
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user_active.png"), screen: "Account" },
  ];

  // --- 3. Обработчик навигации (перехватчик) ---
  const handleNavigationPress = (screenName) => {
    if (screenName === "AddBookModal") {
      setAddBookModalVisible(true); // Открываем меню добавления
    } else {
      navigation.navigate(screenName);
    }
  };

  // Заглушки для действий в меню добавления
  const handleSearchBook = () => {
    setAddBookModalVisible(false);
    console.log("Переход к поиску");
    // navigation.navigate("SearchBook");
  };

  const handleAddManual = () => {
    setAddBookModalVisible(false);
    console.log("Переход к добавлению");
    // navigation.navigate("AddBookManual");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      setMenuVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Start' }],
      });
    } catch (e) {
      console.error("Ошибка выхода:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (!userId) {
            navigation.navigate("Entry");
            return;
          }
          const [userResponse, statsResponse] = await Promise.all([
            api.get(`/api/users_personal_data/${userId}/`),
            api.get(`/api/users_statistics/user/${userId}`)
          ]);
          setUserData(userResponse.data);
          setUserStats(statsResponse.data);
        } catch (error) {
          console.error("Ошибка загрузки профиля:", error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#D7C1AB", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#890524" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => menuVisible && setMenuVisible(false)}>
      <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
        <View style={{ flexDirection: "column" }}>
          <OwlReadsTitle>OwlReads</OwlReadsTitle>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 12, gap: 25 }}>
          <UserContainer>
            <MoreButton onPress={() => setMenuVisible(!menuVisible)}>
              <Image
                source={require("../assets/more.png")}
                style={{ width: 35, height: 35 }}
              />
            </MoreButton>

            {menuVisible && (
              <MenuContainer>
                <MenuItem onPress={() => { console.log("Настройка профиля"); setMenuVisible(false); }}>
                  <MenuText>Настройка профиля</MenuText>
                </MenuItem>
                 <MenuItem onPress={handleLogout}>
                  <MenuTextLogout>Выйти из аккаунта</MenuTextLogout>
                </MenuItem>
              </MenuContainer>
            )}

            <Image
              source={
                userData.profile_photo 
                  ? { uri: userData.profile_photo } 
                  : require("../assets/user_icon.png")
              }
              style={{ width: 150, height: 150, borderRadius: 75 }}
            />
          </UserContainer>

          <View style ={{gap: 20}}>
            <View>
              <UserName>{userData.username}</UserName>
              <UserEmail>{userData.email}</UserEmail>
            </View>

            <StatsContainer>
              <StatItem>
                <StatLabel>Всего книг</StatLabel>
                <StatValue>{userStats.books_in_library || 0}</StatValue>
              </StatItem>

              <StatItem>
                <StatLabel>Прочитано</StatLabel>
                <StatValue>{userStats.books_read || 0}</StatValue>
              </StatItem>

              <StatItem>
                <StatLabel>Любимых</StatLabel>
                <StatValue>{userStats.books_favorites || 0}</StatValue>
              </StatItem>
            </StatsContainer>
          </View>

          <View style={{gap: 10, alignItems: "center"}}>
            <TextLabel>Больше всего прочитано книг в жанре</TextLabel>
              <ContainerText>
                <StyledText>{userStats.favorite_genre || "-"}</StyledText>
              </ContainerText>
          </View>

          <View style={{gap: 10, alignItems: "center"}}>
            <TextLabel>Больше всего прочитано книг автора</TextLabel>
              <ContainerText>
                <StyledText>{userStats.favorite_author || "-"}</StyledText>
              </ContainerText>
          </View>
        
        </ScrollView>

        {/* 4. Передаем перехватчик в NavigationBar */}
        <NavigationBar icons={icons} onPressOverride={handleNavigationPress} />
        
        {/* 5. Скрываем TabBar, если открыто меню добавления */}
        {!isAddBookModalVisible && <TabBar color={"#D7C1AB"} />}

        {/* 6. Само модальное окно */}
        <AddBookModal 
          visible={isAddBookModalVisible}
          onClose={() => setAddBookModalVisible(false)}
          onSearch={handleSearchBook}
          onAdd={handleAddManual}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}