import React, { useState, useRef, useEffect } from "react";
import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import styled from "styled-components/native";
import { TabBar } from "../components/Tab_bar";
import UserMessageBubble from "../components/User_message_bubble";
import ReplyMessageBubble from "../components/Reply_message_bubble";

const HeaderWrapper = styled.View`
  background-color: #fdf5e2;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 16px;
  padding-vertical: 10px;
  margin-top: 43px;
`;

const IconButton = styled(TouchableOpacity)`
  width: 35px;
  height: 35px;
`;

const ChatBlock = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin: 0 12px;
`;

const ChatIconWrapper = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: #a28c75;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const OwlIcon = styled.Image`
  width: 37px;
  height: 37px;
`;

const ChatTitle = styled.Text`
  color: #2F2017;
  font-family: "Inter-Regular";
  font-size: 16px;
  font-weight: 400;
  flex-shrink: 1;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fdf5e2;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  padding: 10px 16px;
  margin-bottom: 48px;
`;

const MessageInput = styled.TextInput`
  flex: 1;
  font-family: "Inter-Regular";
  font-size: 16px;
  color: #2f2017;
  padding-vertical: 8px;
  padding-horizontal: 12px;
`;

export default function CorrespondenceScreen({ navigation }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef(null);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const handleSend = () => {
    if (message.trim().length > 0) {
      const userMsg = {
        type: "user",
        text: message,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setMessage("");

      // Автоответ от системы
      setTimeout(() => {
        const replyMsg = {
          type: "system",
          text: "Это автоответ от Букли 🦉",
          time: getCurrentTime(),
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 500);
    }
  };

  // Автоскролл вниз при добавлении нового сообщения
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={{ flex: 1, backgroundColor: "#A28C75" }}>
      {/* Верхняя шапка */}
      <HeaderWrapper>
        <HeaderContainer>
          <IconButton onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/chevron_left.png")}
              style={{ width: 35, height: 35 }}
            />
          </IconButton>

          <ChatBlock>
            <ChatIconWrapper>
              <OwlIcon source={require("../assets/Owl_icon.png")} />
            </ChatIconWrapper>
            <ChatTitle numberOfLines={1}>Букля</ChatTitle>
          </ChatBlock>

          <IconButton>
            <Image
              source={require("../assets/more.png")}
              style={{ width: 35, height: 35 }}
            />
          </IconButton>
        </HeaderContainer>
      </HeaderWrapper>

      <View style={{ flex: 1, backgroundColor: "#A28C75" }}>
        {/* Основное содержимое чата */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, index) =>
            msg.type === "user" ? (
              <UserMessageBubble key={index} text={msg.text} time={msg.time} />
            ) : (
              <ReplyMessageBubble key={index} text={msg.text} time={msg.time} />
            )
          )}
        </ScrollView>

        {/* Нижний блок ввода */}
        <InputWrapper>
          <MessageInput
            placeholder="Введите сообщение..."
            placeholderTextColor="#A28C75"
            value={message}
            onChangeText={setMessage}
          />
          <IconButton onPress={handleSend}>
            <Image
              source={require("../assets/send.png")}
              style={{ width: 35, height: 35 }}
            />
          </IconButton>
        </InputWrapper>

        {/* Нижняя панель */}
        <TabBar color={"#FDF5E2"} />
      </View>
    </View>
  );
}
