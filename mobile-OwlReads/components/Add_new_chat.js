// components/Chat_item.js
import React from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View, Image } from "react-native";

const ChatContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 2px solid #a28c75;
  padding: 12px;
  /* убираем margin-vertical */
  margin-vertical: 0px;
`;

const ChatIconWrapper = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 50px;
  background-color: #a28c75;
  justify-content: center;
  align-items: center;
`;

const ChatImage = styled.Image`
  width: 75%;
  height: 75%;
`;

const ChatTextWrapper = styled.View`
  flex-direction: column;
  margin-left: 12px;
  
`;

const ChatTitle = styled.Text`
  font-family: "Inter-Regular";
  font-size: 17px;
  color: #FDF5E2;
  margin-bottom: 7px;
`;


export default function AddNewChatItem() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Сorrespondence")}>
      <ChatContainer>

        <ChatIconWrapper>
          <ChatImage source={require("../assets/add_new_chat_icon.png")} />
        </ChatIconWrapper>

        <ChatTextWrapper>
          <ChatTitle>Начать новую беседу</ChatTitle>
        </ChatTextWrapper>

      </ChatContainer>
    </TouchableOpacity>
  );
}
