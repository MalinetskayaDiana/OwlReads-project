// components/Popular_quote.js
import React from "react";
import styled from "styled-components/native";

const QuoteContainer = styled.View`
  background-color: #fdf5e2;
  border-radius: 20px;
  padding: 15px;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: auto;
  margin-left: 16px;
  margin-right: 16px;
`;

const QuoteText = styled.Text`
  color: #2f2017;
  font-family: "Inter-Regular";
  font-size: 15px;
  font-weight: 400;
  text-align: center;
  align-self: stretch;
`;

const QuoteAuthor = styled.Text`
  color: #890524;
  font-family: "Inter-Regular";
  font-size: 13px;
  font-weight: 400;
  text-align: right;
  align-self: stretch;
`;

export default function Quote({ quote_text, quote_author }) {
  return (
    <QuoteContainer>
      <QuoteText>{quote_text}</QuoteText>
      <QuoteAuthor>{quote_author}</QuoteAuthor>
    </QuoteContainer>
  );
}
