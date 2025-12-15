import React, { useState } from "react";
import { View, Pressable, Alert, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import RedButton from "../components/Red_button";
import BackgroundPaper from "../components/Background_paper";
import InputField from "../components/Input_field";
import api from "../src/api/client"; // Убедись, что путь правильный

// --- STYLED COMPONENTS (Без изменений) ---
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

export default function RegistrationScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Данные формы
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordDuble, setPasswordDuble] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [code, setCode] = useState("");

  // Ошибки
  const [errors, setErrors] = useState({});

  // --- ВАЛИДАЦИЯ ФОРМЫ ---
  const validateStep1 = () => {
    let valid = true;
    let newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Введите имя пользователя*";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Введите email*";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Некорректный формат email*";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Введите пароль*";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Минимум 6 символов*";
      valid = false;
    }

    if (password !== passwordDuble) {
      newErrors.passwordDuble = "Пароли не совпадают*";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // --- ШАГ 1: РЕГИСТРАЦИЯ ---
  const handleRegister = async () => {
    // 1. Проверка полей
    if (!validateStep1()) return;

    // 2. Проверка чекбокса
    if (!accepted) {
      Alert.alert("Ошибка", "Необходимо принять условия соглашения");
      return;
    }

    setIsLoading(true);
    try {
      // 3. Отправка на бэкенд
      const payload = {
        username: username,
        email: email,
        password_hash: password, // Бэк сам захеширует
        agreement_accepted: accepted,
        profile_photo: null
      };

      // POST /api/users_personal_data/
      await api.post("/api/users_personal_data/", payload);
      
      // Если успешно (201 Created), переходим к вводу кода
      setStep(2);

    } catch (error) {
      console.error("Ошибка регистрации:", error);
      if (error.response) {
        const detail = error.response.data.detail;
        // Обработка ошибок от FastAPI
        if (typeof detail === "string") {
            if (detail.includes("Email")) {
                setErrors(prev => ({ ...prev, email: "Email уже занят*" }));
            } else if (detail.includes("username")) { // Если добавишь проверку юзернейма на бэке
                setErrors(prev => ({ ...prev, username: "Имя занято*" }));
            } else {
                Alert.alert("Ошибка", detail);
            }
        } else {
            Alert.alert("Ошибка", "Проверьте данные");
        }
      } else {
        Alert.alert("Ошибка сети", "Нет соединения с сервером");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- ШАГ 2: ПОДТВЕРЖДЕНИЕ КОДА ---
  const handleConfirmRegistration = async () => {
    if (!code.trim()) {
      setErrors({ code: "Введите код подтверждения*" });
      return;
    }

    setIsLoading(true);
    try {
      // POST /api/users_personal_data/verify
      const payload = {
        email: email,
        code: code
      };

      await api.post("/api/users_personal_data/verify", payload);
      
      // Если успешно (200 OK), переходим к финалу
      setStep(3);

    } catch (error) {
      console.error("Ошибка верификации:", error);
      if (error.response && error.response.status === 400) {
        setErrors({ code: "Неверный код подтверждения*" });
      } else {
        Alert.alert("Ошибка", "Не удалось подтвердить код");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    // Пока просто заглушка, так как на бэке нет отдельного эндпоинта resend
    // Можно попробовать вызвать create_user снова, но он вернет 400, если юзер есть.
    // Для MVP можно сказать пользователю проверить спам.
    Alert.alert("Инфо", "Проверьте папку Спам. Если письма нет, попробуйте зарегистрироваться заново через 10 минут.");
  };

  // Функция для очистки ошибки при вводе
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

      {/* --- ЭКРАН 1: ВВОД ДАННЫХ --- */}
      {step === 1 && (
        <RegistrationCard>
          <RegistrationCardTitle>Регистрация</RegistrationCardTitle>
          
          <InputField
            value={username}
            onChangeText={(text) => { setUserName(text); clearError("username"); }}
            placeholder="Имя пользователя"
            error={errors.username}
          />
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
            secureTextEntry={true} // Скрываем пароль
          />
          <InputField
            value={passwordDuble}
            onChangeText={(text) => { setPasswordDuble(text); clearError("passwordDuble"); }}
            placeholder="Повторите пароль"
            error={errors.passwordDuble}
            secureTextEntry={true} // Скрываем пароль
          />

          <Pressable onPress={() => setAccepted(!accepted)}>
            <CheckboxContainer>
              <CheckboxBox checked={accepted} />
              <CheckboxLabel>
                Я ознакомлен(а) и принимаю условия Пользовательского соглашения и Политику конфиденциальности
              </CheckboxLabel>
            </CheckboxContainer>
          </Pressable>

          {isLoading ? (
            <ActivityIndicator size="large" color="#890524" />
          ) : (
            <RedButton name={"Зарегистрироваться"} onPress={handleRegister} />
          )}
        </RegistrationCard>
      )}

      {/* --- ЭКРАН 2: ВВОД КОДА --- */}
      {step === 2 && (
        <RegistrationCard>
          <RegistrationCardTitle>Подтверждение регистрации</RegistrationCardTitle>
          <CheckboxLabel style={{ marginHorizontal: 32, marginBottom: 10, textAlign: "center" }}>
            На вашу почту отправлен код подтверждения. Введите его ниже, чтобы завершить регистрацию.
          </CheckboxLabel>

          <InputField
            value={code}
            onChangeText={(text) => { setCode(text); clearError("code"); }}
            placeholder="Введите код из письма"
            error={errors.code}
            keyboardType="number-pad"
          />

          <Pressable onPress={handleResendCode}>
            <CheckboxLabel style={{ color: "#890524", marginHorizontal: 32, marginBottom: 162, textAlign: "right" }}>
              Отправить код ещё раз
            </CheckboxLabel>
          </Pressable>

          {isLoading ? (
            <ActivityIndicator size="large" color="#890524" />
          ) : (
            <RedButton name={"Подтвердить регистрацию"} onPress={handleConfirmRegistration} />
          )}
        </RegistrationCard>
      )}

      {/* --- ЭКРАН 3: УСПЕХ --- */}
      {step === 3 && (
        <RegistrationCard style={{ gap: 295 }}>
          <View style={{ gap: 20 }}>
            <RegistrationCardTitle>Подтверждение регистрации</RegistrationCardTitle>
            <CheckboxLabel style={{ marginHorizontal: 32, marginBottom: 10, textAlign: "center" }}>
              Ваша регистрация прошла успешно.
            </CheckboxLabel>
          </View>

          <RedButton 
            name={"Войти"} 
            onPress={() => navigation.navigate("Entry")} // Убедись, что экран называется "Entry"
          />
        </RegistrationCard>
      )}
    </View>
  );
}