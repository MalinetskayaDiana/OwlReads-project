import React from "react";
import styled from "styled-components/native";

const BubbleWrapper = styled.View`
  background-color: #FDF5E2;
  padding-horizontal: 15px;
  padding-top: 7px;
  padding-bottom: 4px;
  margin: 6px 12px;
  max-width: 80%;
  align-self: flex-start;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 20px;
`;

const MessageText = styled.Text`
  color: #2F2017;
  font-family: "Inter-Regular";
  font-size: 15px;
`;

const TimeText = styled.Text`
  color: #A28C75;
  font-family: "Inter-Regular";
  font-size: 12px;
  text-align: right;
`;

export default function ReplyMessageBubble({ text, time }) {
  return (
    <BubbleWrapper>
      <MessageText>{text}</MessageText>
      <TimeText>{time}</TimeText>
    </BubbleWrapper>
  );
}
