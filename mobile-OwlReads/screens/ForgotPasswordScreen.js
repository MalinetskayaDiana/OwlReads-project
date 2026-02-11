import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
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
  gap: 15px;
  align-items: center;
  margin-left: 32px;
  margin-right: 32px;
`;

const RegistrationCardTitle = styled.Text`
  color: #890524;
  font-family: "VollkornSC-Regular";
  font-size: 25px;
  text-align: center;
  margin-bottom: 10px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-horizontal: 5px;
`;

const LetterImage = styled.Image`
  width: 45px;
  height: 45px;
`;

const TimerColumn = styled.View`
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
  flex: 1; 
`;

const SendAgainText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 12px;
  color: #2F2017;
`;

const CountdownText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 13px;
  color: #A28C75;
  font-weight: bold;
`;

const CompactButton = ({ onPress, name, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={{ width: 120 }}>
    <LinearGradient
      colors={disabled ? ["#A28C75", "#D3CDBF"] : ["#890524", "#230109"]}
      style={{ borderRadius: 10, paddingVertical: 10, alignItems: "center" }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SendAgainText style={{ color: "#FDF5E2", fontSize: 12, fontFamily: "Inter" }}>{name}</SendAgainText>
    </LinearGradient>
  </TouchableOpacity>
);

const InfoText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 13px;
  color: #A28C75;
  text-align: left;
  margin-top: 5px;
  padding-horizontal: 10px;
`;

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPasswordPhase, setIsPasswordPhase] = useState(false); // Новая фаза
  
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendCode = () => {
    if (!email.trim() || !email.includes("@")) {
      setErrors({ email: "Введите корректный email*" });
      return;
    }
    setErrors({});
    setIsCodeSent(true);
    setIsTimerActive(true);
    setTimer(60);
  };

  // Проверка кода и переход к вводу пароля
  const handleVerifyCode = () => {
    if (code === "1111") {
      setErrors({});
      setIsPasswordPhase(true); // Переключаем экран
    } else {
      setErrors({ code: "Неверный код*" });
    }
  };

  // Финальное сохранение и вход
  const handleFinalLogin = () => {
    if (newPassword.length < 6) {
      setErrors({ newPassword: "Пароль слишком короткий*" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Пароли не совпадают*" });
      return;
    }
    // Если всё ок — на главную
    navigation.navigate("Home");
  };

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
        <RegistrationCardTitle style={{fontSize: 22}}>Восстановление пароля</RegistrationCardTitle>
        
        {!isPasswordPhase ? (
          // --- ФАЗА 1 И 2: ВВОД EMAIL И КОДА ---
          <>
            <InputField
              value={email}
              onChangeText={(text) => { setEmail(text); clearError("email"); }}
              placeholder="Электронная почта"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <ActionRow>
              <LetterImage source={require("../assets/letter.png")} resizeMode="contain" />
              <TimerColumn>
                <SendAgainText style={{color: "#A28C75", fontSize: 13, fontFamily: "Inter"}}>Отправить ещё раз</SendAgainText>
                <CountdownText>{isTimerActive ? formatTime(timer) : "1:00"}</CountdownText>
              </TimerColumn>
              <CompactButton 
                name="Отправить код" 
                onPress={handleSendCode} 
                disabled={isTimerActive} 
              />
            </ActionRow>

            {isCodeSent && (
              <>
                <InfoText>
                  На вашу почту было отправлено письмо с кодом, пожалуйста, введите его.
                </InfoText>
                <InputField
                  value={code}
                  onChangeText={(text) => { setCode(text); clearError("code"); }}
                  placeholder="Код"
                  error={errors.code}
                  keyboardType="number-pad"
                />
                <RedButton 
                    name="Ввести новый пароль" 
                    onPress={handleVerifyCode} 
                />
              </>
            )}
          </>
        ) : (
          // --- ФАЗА 3: ВВОД НОВОГО ПАРОЛЯ ---
          <>
            <InputField
              value={newPassword}
              onChangeText={(text) => { setNewPassword(text); clearError("newPassword"); }}
              placeholder="Новый пароль"
              error={errors.newPassword}
              secureTextEntry={true}
            />
            <InputField
              value={confirmPassword}
              onChangeText={(text) => { setConfirmPassword(text); clearError("confirmPassword"); }}
              placeholder="Подтвердите пароль"
              error={errors.confirmPassword}
              secureTextEntry={true}
            />
            <RedButton 
                name="Войти" 
                onPress={handleFinalLogin} 
            />
          </>
        )}
      </RegistrationCard>
    </View>
  );
}