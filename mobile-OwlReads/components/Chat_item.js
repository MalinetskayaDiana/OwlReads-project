// components/Chat_item.js
import React from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View, Image } from "react-native";

const ChatContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 2px;
  border-color: #a28c75;
  padding: 12px;
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

const ChatMessage = styled.Text`
  font-family: "Inter-Regular";
  font-size: 12px;
  color: #2F2017;
`;

export default function ChatItem({ title, message }) {
  return (
    <TouchableOpacity>
      <ChatContainer>

        <ChatIconWrapper>
          <ChatImage source={require("../assets/Owl_icon.png")} />
        </ChatIconWrapper>

        <ChatTextWrapper>
          <ChatTitle>{title}</ChatTitle>
          <ChatMessage>{message}</ChatMessage>
        </ChatTextWrapper>

      </ChatContainer>
    </TouchableOpacity>
  );
}
