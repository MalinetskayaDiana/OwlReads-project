import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Text, Modal, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Не забудь установить: npx expo install expo-image-picker
import RedButton from "../components/Red_button";
import api from "../src/api/client";

// --- КОНСТАНТЫ ИКОНОК ---
const AVATAR_PRESETS = [
  { id: 'user_icon', source: require("../assets/user_icon.png") },
  { id: 'owl_icon_yellow', source: require("../assets/owl_icon_yellow.png") }, // Замени на свои пути к совам
  { id: 'owl_icon_red', source: require("../assets/owl_icon_red.png") },
  { id: 'owl_icon_blue', source: require("../assets/owl_icon_blue.png") },
  { id: 'owl_icon_green', source: require("../assets/owl_icon_green.png") },
];

// --- СТИЛИ ---
const Container = styled.View`
  flex: 1;
  background-color: #fdf5e2;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  marginTop: 48px;
  margin-horizontal: 23px;
`;

const OwlReadsTitle = styled.Text`
  color: #230109;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  text-align: center;
`;

const ScreenTitle = styled.Text`
  color: #890524;
  font-family: "VollkornSC-Regular";
  font-size: 27px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const PhotoSection = styled.TouchableOpacity`
  align-self: center;
  margin-bottom: 40px;
`;

const ProfileImage = styled.Image`
  width: 130px;
  height: 130px;
  border-radius: 65px;
  border-width: 2px;
  border-color: #a28c75;
`;

const EditBadge = styled.View`
  position: absolute;
  right: 0;
  bottom: 5px;
  background-color: #890524;
  width: 34px;
  height: 34px;
  border-radius: 17px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: #fdf5e2;
`;

const InputGroup = styled.View`
  margin-horizontal: 30px;
  margin-bottom: 25px;
`;

const LabelText = styled.Text`
  font-family: "Inter-Medium";
  font-size: 14px;
  color: #890524;
  margin-bottom: 5px;
`;

const UnderlinedInput = styled.TextInput`
  font-family: "Inter-Regular";
  font-size: 16px;
  color: #2F2017;
  border-bottom-width: 1.5px;
  border-bottom-color: #6C5141;
  padding-vertical: 5px;
`;

const ChangePasswordText = styled.Text`
  font-family: "Inter-Medium";
  font-size: 14px;
  color: #6C5141;
  text-decoration-line: underline;
  margin-horizontal: 30px;
  margin-bottom: 20px;
`;

const SectionSeparator = styled.View`
  height: 1px;
  background-color: #6C5141;
  margin-vertical: 20px;
  opacity: 0.3;
`;

const DeleteAccountButton = styled.TouchableOpacity`
  margin-top: 30px;
  align-self: center;
  margin-bottom: 20px;
`;

const DeleteAccountText = styled.Text`
  font-family: "Inter-Medium";
  font-size: 14px;
  color: #890524;
  text-decoration-line: underline;
`;

// --- СТИЛИ МОДАЛЬНОГО ОКНА ---
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(47, 32, 23, 0.6);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  background-color: #FDF5E2;
  width: 90%;
  border-radius: 20px;
  padding: 25px;
  align-items: center;
  elevation: 10;
`;

const ModalTitle = styled.Text`
  font-family: "VollkornSC-Regular";
  font-size: 22px;
  color: #890524;
  margin-bottom: 20px;
`;

const AvatarGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const AvatarItem = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  border-width: 3px;
  border-color: ${props => props.isSelected ? '#890524' : 'transparent'};
  padding: 2px;
`;

const AvatarImg = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 30px;
`;

// --- КОМПОНЕНТ ---
export default function SettingsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Состояние модалки
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await api.get(`/api/users_personal_data/${userId}/`);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setProfilePhoto(response.data.profile_photo);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось загрузить данные");
    } finally {
      setFetching(false);
    }
  };

  // Функция для получения источника изображения
  const getAvatarSource = (photo) => {
    if (!photo) return require("../assets/user_icon.png");
    
    // Проверяем, является ли это пресетом
    const preset = AVATAR_PRESETS.find(p => p.id === photo);
    if (preset) return preset.source;

    // Если это ссылка с сервера
    if (photo.startsWith('/static')) {
      return { uri: `${api.defaults.baseURL}${photo}` };
    }
    
    // Если это локальный URI после выбора из галереи
    return { uri: photo };
  };

  // Выбор встроенной иконки
  const handleSelectPreset = (presetId) => {
    setProfilePhoto(presetId);
    setAvatarModalVisible(false);
  };

  // Выбор своего фото из галереи
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
      setAvatarModalVisible(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert("Ошибка", "Имя и почта обязательны");
      return;
    }

    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      
      formData.append('username', username);
      formData.append('email', email);

      if (isChangingPassword) {
        if (newPassword !== confirmPassword) {
          Alert.alert("Ошибка", "Пароли не совпадают");
          setLoading(false);
          return;
        }
        formData.append('old_password', oldPassword);
        formData.append('password', newPassword);
      }

      // Логика отправки фото
      if (profilePhoto) {
        if (profilePhoto.startsWith('file://') || profilePhoto.startsWith('content://')) {
          // Если это файл из галереи
          const filename = profilePhoto.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;
          formData.append('profile_photo_file', { uri: profilePhoto, name: filename, type });
        } else {
          // Если это ID пресета или старая ссылка
          formData.append('profile_photo', profilePhoto);
        }
      }

      await api.patch(`/api/users_personal_data/${userId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Alert.alert("Успех", "Данные обновлены", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error) {
      const errorMsg = error.response?.data?.detail === "Incorrect old password" 
        ? "Неверный старый пароль" 
        : "Не удалось сохранить изменения";
      Alert.alert("Ошибка", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Удаление аккаунта",
      "Вы уверены? Все данные будут удалены навсегда.",
      [
        { text: "Нет", style: "cancel" },
        { 
          text: "Да, удалить", 
          style: "destructive", 
          onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem('userId');
              await api.delete(`/api/users_personal_data/${userId}/`);
              await AsyncStorage.clear();
              navigation.reset({ index: 0, routes: [{ name: 'Start' }] });
            } catch (e) { Alert.alert("Ошибка", "Не удалось удалить аккаунт"); }
          }
        }
      ]
    );
  };

  if (fetching) {
    return <Container style={{ justifyContent: "center" }}><ActivityIndicator size="large" color="#890524" /></Container>;
  }

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/chevron_left.png")} style={{ width: 35, height: 35 }} resizeMode="contain" />
        </TouchableOpacity>
        <OwlReadsTitle>OwlReads</OwlReadsTitle>
        <View style={{ width: 35 }} />
      </Header>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ScreenTitle>Настройки профиля</ScreenTitle>

        <PhotoSection onPress={() => setAvatarModalVisible(true)}>
          <ProfileImage source={getAvatarSource(profilePhoto)} />
          <EditBadge>
            <Image source={require("../assets/pencil.png")} style={{ width: 18, height: 18, tintColor: '#FDF5E2' }} />
          </EditBadge>
        </PhotoSection>

        <InputGroup>
          <LabelText>Имя пользователя</LabelText>
          <UnderlinedInput value={username} onChangeText={setUsername} />
        </InputGroup>

        <InputGroup>
          <LabelText>Электронная почта</LabelText>
          <UnderlinedInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </InputGroup>

        <SectionSeparator />

        {!isChangingPassword ? (
          <TouchableOpacity onPress={() => setIsChangingPassword(true)}>
            <ChangePasswordText>Изменить пароль</ChangePasswordText>
          </TouchableOpacity>
        ) : (
          <View>
            <InputGroup>
              <LabelText>Старый пароль</LabelText>
              <UnderlinedInput secureTextEntry value={oldPassword} onChangeText={setOldPassword} />
            </InputGroup>
            <InputGroup>
              <LabelText>Новый пароль</LabelText>
              <UnderlinedInput secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            </InputGroup>
            <InputGroup>
              <LabelText>Подтвердите новый пароль</LabelText>
              <UnderlinedInput secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            </InputGroup>
            <TouchableOpacity onPress={() => setIsChangingPassword(false)}>
              <ChangePasswordText style={{ color: '#A28C75', textDecorationLine: 'none' }}>Отмена</ChangePasswordText>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ marginTop: 10, marginHorizontal: 30 }}>
          {loading ? <ActivityIndicator size="large" color="#890524" /> : <RedButton name="Сохранить изменения" onPress={handleSave} />}
        </View>

        <DeleteAccountButton onPress={handleDeleteAccount}>
          <DeleteAccountText>Удалить учетную запись</DeleteAccountText>
        </DeleteAccountButton>
      </ScrollView>

      {/* --- МОДАЛКА ВЫБОРА АВАТАРА --- */}
      <Modal
        visible={isAvatarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAvatarModalVisible(false)}>
          <ModalOverlay>
            <TouchableWithoutFeedback>
              <ModalContainer>
                <ModalTitle>Выберите иконку</ModalTitle>
                
                <AvatarGrid>
                  {AVATAR_PRESETS.map((item) => (
                    <AvatarItem 
                      key={item.id} 
                      isSelected={profilePhoto === item.id}
                      onPress={() => handleSelectPreset(item.id)}
                    >
                      <AvatarImg source={item.source} />
                    </AvatarItem>
                  ))}
                  
                  {/* Кнопка добавления своего фото */}
                  <AvatarItem onPress={handlePickImage} style={{ backgroundColor: '#E8DFC9', justifyContent: 'center', alignItems: 'center' }}>
                    <Image 
                      source={require("../assets/add_new_chat_icon.png")} 
                      style={{ width: 35, height: 35, tintColor: '#890524' }} 
                    />
                  </AvatarItem>
                </AvatarGrid>

                <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                  <Text style={{ fontFamily: "Inter-Medium", color: "#6C5141" }}>Отмена</Text>
                </TouchableOpacity>
              </ModalContainer>
            </TouchableWithoutFeedback>
          </ModalOverlay>
        </TouchableWithoutFeedback>
      </Modal>
    </Container>
  );
}