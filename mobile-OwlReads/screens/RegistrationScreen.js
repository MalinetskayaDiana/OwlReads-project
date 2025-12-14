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

const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-horizontal: 32px;
`;

const CheckboxBox = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border-width: 2px;
  border-color: #D3CDBF;
  background-color: ${(props) => (props.checked ? "#890524" : "transparent")};
  margin-right: 10px;
`;

const CheckboxLabel = styled.Text`
  color: #A28C75;
  font-family: "Inter-Regular";
  font-size: 13px;
  flex-shrink: 1;
`;

export default function RegistrationScreen() {
  const [step, setStep] = useState(1);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordDuble, setPasswordDuble] = useState("");
  const [accepted, setAccepted] = useState(false); 

  const [code, setCode] = useState("");

  const [error, setError] = useState("");

  const handleRegister = () => {
    // простая проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      // здесь можно добавить логику регистрации
      console.log("Регистрация прошла успешно:", { username, email, password });
      setStep(2);
    }
  };

  const handleConfirmRegistration = () => {
    if (!code.trim()) {
      setError("Введите код подтверждения");
    } else {
      setError("");
      console.log("Регистрация подтверждена:", code);
      setStep(3);
      // здесь можно добавить переход на экран входа или Home
    }
  };

  const handleResendCode = () => {
    console.log("Отправляем код повторно на:", email);
    // логика повторной отправки
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB" }}>
      <View style={{top: 100}}>
        <OwlReadsTitle>OwlReads</OwlReadsTitle>
        <OwlReadsSubTitle>Начни свою {"\n"} книжную историю!</OwlReadsSubTitle>
      </View>
      <BackgroundPaper />

      {step === 1 && (
        <RegistrationCard>
          <RegistrationCardTitle>Регистрация</RegistrationCardTitle>
          <InputField
            value={username}
            onChangeText={setUserName}
            placeholder="Имя пользователя"
            error={error}
          />
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
          <InputField
            value={passwordDuble}
            onChangeText={setPasswordDuble}
            placeholder="Повторите пароль"
            error={error}
          />

          <Pressable onPress={() => setAccepted(!accepted)}>
            <CheckboxContainer>
              <CheckboxBox checked={accepted} />
              <CheckboxLabel>
                Я ознакомлен(а) и принимаю условия Пользовательского соглашения и Политику конфиденциальности
              </CheckboxLabel>
            </CheckboxContainer>
          </Pressable>

          <RedButton name={"Зарегистрироваться"} onPress={handleRegister} />
        </RegistrationCard>
      )}

      {step === 2 && (
        <RegistrationCard>
            <RegistrationCardTitle>Подтверждение регистрации</RegistrationCardTitle>
            <CheckboxLabel style={{ marginHorizontal: 32, marginBottom: 10, textAlign: "center" }}>
              На вашу почту отправлен код подтверждения. Введите его ниже, чтобы завершить регистрацию.
            </CheckboxLabel>

            <InputField
              value={code}
              onChangeText={setCode}
              placeholder="Введите код из письма"
              error={error}
            />

            <Pressable onPress={handleResendCode}>
              <CheckboxLabel style={{ color: "#890524", marginHorizontal: 32, marginBottom: 162, textAlign: "right"}}>
                Отправить код ещё раз
              </CheckboxLabel>
            </Pressable>

          <RedButton name={"Подтвердить регистрацию"} onPress={handleConfirmRegistration} />
        </RegistrationCard>
      )}

      {step === 3 && (
        <RegistrationCard style={{gap: 295}}>
          <View style={{gap: 20}}>
            <RegistrationCardTitle>Подтверждение регистрации</RegistrationCardTitle>
            <CheckboxLabel style={{ marginHorizontal: 32, marginBottom: 10, textAlign: "center" }}>
              Ваша регистрация прошла успешно.
            </CheckboxLabel>
          </View>

          <RedButton name={"Войти"} screen={"Entry"} />
        </RegistrationCard>
      )}

    </View>
  );
}