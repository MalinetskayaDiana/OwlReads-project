// components/Navigation_bar.js
import React from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View, Image } from "react-native";

const NavigationContainer = styled.View`
  background-color: #fdf5e2;
  border-radius: 20px;
  padding-top: 7px;
  padding-bottom: 7px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: auto;
  margin-left: 16px;
  margin-right: 16px;
  padding-left: 30px;
  padding-right: 30px;

  position: absolute;
  bottom: 57px;
  left: 0;
  right: 0;
`;

export default function NavigationBar({ icons, onPressOverride }) {
  const navigation = useNavigation();

  return (
    <NavigationContainer>
      {icons.map((icon, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (onPressOverride) {
              onPressOverride(icon.screen);
            } else {
              navigation.navigate(icon.screen);
            }
          }}
        >

          <Image
            source={icon.source}
            style={{
              width: icon.name === "add_book" ? 55 : 45,
              height: icon.name === "add_book" ? 55 : 45,
            }}
          />
        </TouchableOpacity>
      ))}
    </NavigationContainer>
  );
}
