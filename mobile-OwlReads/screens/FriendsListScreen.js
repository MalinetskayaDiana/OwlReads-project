import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

const Container = styled.View`
  flex: 1;
  background-color: #D7C1AB;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-horizontal: 16px;
  padding-top: 10px;
  margin-bottom: 20px;
`;

const OwlReadsTitle = styled.Text`
  color: #230109;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  text-align: center;
`;

const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 16px;
  color: #6C5141;
  opacity: 0.6;
`;

export default function FriendsListScreen({ navigation }) {
  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          {/* Кнопка назад */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image 
              source={require("../assets/chevron_left.png")} 
              style={{ width: 35, height: 35, tintColor: "#230109" }} 
            />
          </TouchableOpacity>

          <OwlReadsTitle>OwlReads</OwlReadsTitle>

          {/* Кнопка добавить друга */}
          <TouchableOpacity onPress={() => navigation.navigate("AddFriend")}>
            <Image 
              source={require("../assets/add_friend.png")} 
              style={{ width: 35, height: 35, tintColor: "#230109" }} 
            />
          </TouchableOpacity>
        </Header>

        <Content>
          <EmptyText>Список друзей пока пуст</EmptyText>
        </Content>
      </SafeAreaView>
    </Container>
  );
}