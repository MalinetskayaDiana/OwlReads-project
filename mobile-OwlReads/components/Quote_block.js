// components/QuoteBlock.js
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";

const BlockContainer = styled.View`
  margin-horizontal: 20px;
  margin-bottom: 10px;
  border-radius: 20px;
  border-width: 2px;
  border-color: #a28c75;
  padding-horizontal: 10px;
  padding-vertical: 15px;
  background-color: #fdf5e2;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitleText = styled.Text`
  font-family: "Inter-Bold";
  font-size: 12px;
  color: #2F2017;
`;

const QuoteText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 14px;
  color: #2F2017;
  margin-top: 10px;
`;

const AuthorText = styled.Text`
  font-family: "Inter-Italic";
  font-size: 13px;
  color: #890524;
  text-align: right;
  margin-top: 6px;
`;

export default function QuoteBlock({ text, author, onEdit, onDelete }) {
  return (
    <BlockContainer>
      <HeaderRow>
        <TitleText>Цитата</TitleText>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity onPress={onDelete}>
            <Image source={require("../assets/trash.png")} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit}>
            <Image source={require("../assets/pencil.png")} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>
      </HeaderRow>

      <QuoteText>{`« ${text} »`}</QuoteText>
      <AuthorText>@{author}</AuthorText>
    </BlockContainer>
  );
}
