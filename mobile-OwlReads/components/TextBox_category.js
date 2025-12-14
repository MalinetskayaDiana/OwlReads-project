// components/TextBoxCategory.js
import React from "react";
import styled from "styled-components/native";
import { Image, View } from "react-native";

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  padding-horizontal: 15px;
  border-radius: 20px;
  align-self: flex-start;
`;

const StyledText = styled.Text`
  font-family: Inter-Regular;
  font-size: 15px;
  opacity: 1;
  flex: 1;
`;

export const TextBoxCategory = ({ text, color }) => {
  return (
    <Container style={{ backgroundColor: hexToRgba(color, 0.2) }}>
      <StyledText style={{ color }}>{text}</StyledText>
      <Image
        source={require("../assets/chevron_down.png")}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
      />
    </Container>
  );
};
