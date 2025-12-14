import React from "react";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

const BubbleWrapper = styled(LinearGradient)`
  padding-horizontal: 15px;
  padding-top: 7px;
  padding-bottom: 4px;
  margin: 6px 12px;
  max-width: 80%;
  align-self: flex-end;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 2px;
`;

const MessageText = styled.Text`
  color: #FDF5E2;
  font-family: "Inter-Regular";
  font-size: 15px;
`;

const TimeText = styled.Text`
  color: #A28C75;
  font-family: "Inter-Regular";
  font-size: 12px;
  text-align: right;
`;

export default function UserMessageBubble({ text, time }) {
  return (
    <BubbleWrapper
      colors={["#890524", "#230109"]}
      locations={[0.17, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <MessageText>{text}</MessageText>
      <TimeText>{time}</TimeText>
    </BubbleWrapper>
  );
}
