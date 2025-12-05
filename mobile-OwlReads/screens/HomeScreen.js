import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";

const Quote = styled.View`
  padding: 15px;
  margin-top: 100px;
  background-color: #FDF5E2;
  height: 100px;
  width: 100%;
  border-radius: 30px;
`;

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <Quote>
        <Text style={{ color: "#2F2017", fontFamily: "Inter", fontSize: 15}}>Вот мой секрет, он очень прост: зорко одно лишь сердце. Самого главного глазами не увидишь</Text>
      </Quote>
    </View>
  );
}
