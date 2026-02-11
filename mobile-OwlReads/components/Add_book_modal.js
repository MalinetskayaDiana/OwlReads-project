// components/AddBookModal.js
import React, { useEffect } from "react";
import { Modal, TouchableWithoutFeedback, Platform, View } from "react-native";
import { useNavigation } from "@react-navigation/native"; // <--- 1. Импорт хука
import styled from "styled-components/native";
import * as NavigationBar from 'expo-navigation-bar';
import RedButton from "./Red_button";

// Фон (Overlay)
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(47, 32, 23, 0.6);
  justify-content: center;
  align-items: center;
`;

// Карточка меню
const MenuContainer = styled.View`
  background-color: #FDF5E2;
  width: 90%;
  border-radius: 20px;
  padding-vertical: 30px;
  padding-horizontal: 12px; 
  align-items: center;
  gap: 15px;
  elevation: 10;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

const MenuTitle = styled.Text`
  font-family: "VollkornSC-Regular";
  font-size: 24px;
  color: #890524;
  margin-bottom: 10px;
  text-align: center;
`;

export default function AddBookModal({ visible, onClose, onSearch }) {
  const navigation = useNavigation(); // <--- 2. Получаем объект навигации

  // Логика для затемнения нижнего бара Android
  useEffect(() => {
  if (Platform.OS === 'android') {
    // Вместо цвета фона меняем только цвет иконок (светлые/темные)
    NavigationBar.setButtonStyleAsync(visible ? "light" : "dark");
  }
}, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Overlay>
          <TouchableWithoutFeedback>
            <MenuContainer>
              <MenuTitle>Добавить книгу</MenuTitle>
              
              <RedButton
                name="Найти книгу"
                onPress={() => {
                  onClose();
                  navigation.navigate("BookSearch"); // Убедись, что имя совпадает с App.js
                }}
              />

              <RedButton
                name="Найти по штрихкоду"
                onPress={() => {
                  onClose(); // Сначала закрываем меню
                  navigation.navigate("BarcodeScanner"); // Потом переходим
                }}
              />

              <RedButton
                name="Добавить вручную"
                onPress={() => {
                  onClose(); // Сначала закрываем меню
                  navigation.navigate("BookManualAdd"); // Потом переходим
                }}
              />

            </MenuContainer>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
}