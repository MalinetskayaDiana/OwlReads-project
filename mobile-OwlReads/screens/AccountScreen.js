// screens/AccountScreen.js
import React, {useState} from "react";
import { View, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import NavigationBar from "../components/Navigation_bar";
import { TabBar } from "../components/Tab_bar";

const OwlReadsTitle = styled.Text`
  color: #fdf5e2;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  font-weight: 400;
  justify-content: center;
  align-items: center;
  text-align: center;
  marginTop: 48px;
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
  elevation: 5;
  z-index: 10; 
  shadow-color: #000;
  shadow-opacity: 0.2;
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
  font-family: "Inter-Regular"; 
  font-size: 14px; 
  color: #890524;
`;

const UserName = styled.Text`
  align-items: center;
  color: #890524;
  display: flex;
  font-family: "VollkornSC-Bold";
  font-size: 25px;
  justyfy-content: center;
  position: relative;
  text-align: center;
  margin-top: -10px;
`;

const UserEmail = styled.Text`
  align-items: center;
  aligh-self: stretch;
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
  const [menuVisible, setMenuVisible] = useState(false);

  const icons = [
    { name: "home", source: require("../assets/home.png"), screen: "Home" },
    { name: "open_book", source: require("../assets/open_book.png"), screen: "Library" },
    { name: "add_book", source: require("../assets/add_book.png"), screen: "Library" },
    { name: "message", source: require("../assets/message.png"), screen: "Chats" },
    { name: "user", source: require("../assets/user_active.png"), screen: "Account" },
  ];

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
                <MenuItem onPress={() => { console.log("Выйти из аккаунта"); setMenuVisible(false); }}>
                  <MenuTextLogout>Выйти из аккаунта</MenuTextLogout>
                </MenuItem>
              </MenuContainer>
            )}

            <Image
              source={require("../assets/user_icon.png")}
              style={{ width: 150, height: 150 }}
            />
          </UserContainer>

          <View style ={{gap: 20}}>
            <View>
              <UserName>Dana</UserName>
              <UserEmail>malinetskaya@gmail.com</UserEmail>
            </View>

            <StatsContainer>
              <StatItem>
                <StatLabel>Всего книг</StatLabel>
                <StatValue>125</StatValue>
              </StatItem>

              <StatItem>
                <StatLabel>Прочитано</StatLabel>
                <StatValue>87</StatValue>
              </StatItem>

              <StatItem>
                <StatLabel>Любимых</StatLabel>
                <StatValue>12</StatValue>
              </StatItem>
            </StatsContainer>
          </View>

          <View style={{gap: 10, alignItems: "center"}}>
            <TextLabel>Больше всего прочитано книг в жанре</TextLabel>
              <ContainerText>
                <StyledText>Детектив</StyledText>
              </ContainerText>
          </View>

          <View style={{gap: 10, alignItems: "center"}}>
            <TextLabel>Больше всего прочитано книг автора</TextLabel>
              <ContainerText>
                <StyledText>Д. Карризи</StyledText>
              </ContainerText>
          </View>
        
        </ScrollView>


        <NavigationBar icons={icons} />
        <TabBar color={"#D7C1AB"} />
      </View>
    </TouchableWithoutFeedback>
  );
}
