import React, { useState } from "react";
import { View, Pressable, Alert, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RedButton from "../components/Red_button";
import BackgroundPaper from "../components/Background_paper";
import InputField from "../components/Input_field";
import api from "../src/api/client";

const OwlReadsTitle = styled.Text`
  color: #fdf5e2;
  font-family: "Marck Script-Regular";
  font-size: 50px;
  font-weight: 400;
  text-align: center;
  margin-top: 48px;
`;

const OwlReadsSubTitle = styled.Text`
  color: #2F2017;
  font-family: "KoPub-Batang-Regular";
  font-size: 15px;
  text-align: center;
  letter-spacing: 2.5px;
`;

const RegistrationCard = styled.View`
  margin-top: 165px;
  gap: 20px;
  align-items: center;
  width: auto;
  flex-direction: column;
  justify-content: center;
  width: auto;
  margin-left: 32px;
  margin-right: 32px;
`;

const RegistrationCardTitle = styled.Text`
  color: #890524;
  font-family: "VollkornSC-Regular";
  font-size: 25px;
  text-align: center;
`;

const ForgotPasswordContainer = styled.View`
  width: 100%;
  align-items: flex-end;
`;

const ForgotPasswordText = styled.Text`
  color: #890524;
  font-family: "Inter-Regular";
  font-size: 13px;
  text-align: right;
`;

export default function EntryScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Ошибки для конкретных полей
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = () => {
    console.log("Переход на экран восстановления пароля");
    // navigation.navigate("ForgotPassword");
  };

  const handleLogin = async () => {
    // 1. Сброс ошибок
    setErrors({});
    let valid = true;
    let newErrors = {};

    // 2. Валидация
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Введите email*";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Некорректный email*";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Введите пароль*";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    // 3. Отправка запроса
    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/login", {
        email: email,
        password: password
      });

      console.log("Вход успешен:", response.data);
      
      // СОХРАНЯЕМ ДАННЫЕ
      await AsyncStorage.setItem('userToken', response.data.access_token);
      await AsyncStorage.setItem('userId', String(response.data.user_id)); // Важно сохранить ID

      navigation.navigate("Home");

    } catch (error) {
      console.error("Ошибка входа:", error);
      if (error.response && error.response.status === 401) {
        Alert.alert("Ошибка входа", "Неверный email или пароль");
      } else {
        Alert.alert("Ошибка", "Проверьте соединение с интернетом");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Очистка ошибки при вводе
  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{ top: 100 }}>
        <OwlReadsTitle>OwlReads</OwlReadsTitle>
        <OwlReadsSubTitle>Начни свою {"\n"} книжную историю!</OwlReadsSubTitle>
      </View>
      <BackgroundPaper />
      
      <RegistrationCard>
        <RegistrationCardTitle>Вход</RegistrationCardTitle>
        
        <InputField
          value={email}
          onChangeText={(text) => { setEmail(text); clearError("email"); }}
          placeholder="Электронная почта"
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <InputField
          value={password}
          onChangeText={(text) => { setPassword(text); clearError("password"); }}
          placeholder="Пароль"
          error={errors.password}
          secureTextEntry={true}
        />
        
        <ForgotPasswordContainer>
          <Pressable onPress={handleForgotPassword}>
            <ForgotPasswordText>Забыли пароль?</ForgotPasswordText>
          </Pressable>
        </ForgotPasswordContainer>

        {isLoading ? (
          <ActivityIndicator size="large" color="#890524" />
        ) : (
          // Важно: используем onPress, а не screen
          <RedButton name={"Продолжить чтение"} onPress={handleLogin} />
        )}
      </RegistrationCard>
    </View>
  );
}