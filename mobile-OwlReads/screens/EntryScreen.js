import React, { useState } from "react";
import { View, Pressable } from "react-native";
import styled from "styled-components/native";
import RedButton from "../components/Red_button";
import BackgroundPaper from "../components/Background_paper";
import InputField from "../components/Input_field";

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

export default function EntryScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = () => {
    // пока заглушка
    console.log("Переход на экран восстановления пароля");
  };

  const handleRegister = () => {
    // простая проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      setError("Введите имя пользователя");
    } else if (!emailRegex.test(email)) {
      setError("Введите корректный адрес электронной почты");
    } else if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
    } else if (password !== passwordDuble) {
      setError("Пароли не совпадают");
    } else {
      setError("");
      // здесь можно добавить логику регистрации
      console.log("Регистрация прошла успешно:", { username, email, password });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{top: 100}}>
        <OwlReadsTitle>OwlReads</OwlReadsTitle>
        <OwlReadsSubTitle>Начни свою {"\n"} книжную историю!</OwlReadsSubTitle>
      </View>
      <BackgroundPaper />
      <RegistrationCard>
          <RegistrationCardTitle>Вход</RegistrationCardTitle>
          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder="Электронная почта"
            error={error}
          />
          <InputField
            value={password}
            onChangeText={setPassword}
            placeholder="Пароль"
            error={error}
          />
          <ForgotPasswordContainer>
            <Pressable onPress={handleForgotPassword}>
              <ForgotPasswordText>Забыли пароль?</ForgotPasswordText>
            </Pressable>
          </ForgotPasswordContainer>


        <RedButton screen={"Home"} name={"Продолжить чтение"}/>
      </RegistrationCard>
    </View>
  );
}