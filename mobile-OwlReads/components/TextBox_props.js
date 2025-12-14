// components/TextBow_props.js
import React from 'react';
import styled from 'styled-components/native';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Container = styled.View`
  padding-vertical: 5px;
  padding-horizontal: 15px;
  border-radius: 20px;
  align-self: flex-start;
`;

const StyledText = styled.Text`
  font-family: Inter-Regular;
  font-size: 12px;
  opacity: 1;
`;

export const TextBox = ({ text, color }) => {
  return (
    <Container style={{ backgroundColor: hexToRgba(color, 0.2) }}>
      <StyledText style={{ color }}>{text}</StyledText>
    </Container>
  );
};

