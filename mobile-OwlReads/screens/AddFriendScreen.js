import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator, 
  Modal, 
  TouchableWithoutFeedback 
} from "react-native";
import styled from "styled-components/native";
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../src/api/client";
import InputField from "../components/Input_field";
import RedButton from "../components/Red_button";

// --- КОНСТАНТЫ АВАТАРОВ (как в AccountScreen) ---
const AVATAR_PRESETS = [
  { id: 'user_icon', source: require("../assets/user_icon.png") },
  { id: 'owl_icon_yellow', source: require("../assets/owl_icon_yellow.png") },
  { id: 'owl_icon_red', source: require("../assets/owl_icon_red.png") },
  { id: 'owl_icon_blue', source: require("../assets/owl_icon_blue.png") },
  { id: 'owl_icon_green', source: require("../assets/owl_icon_green.png") },
];

// --- СТИЛИ ---
const Container = styled.View`
  flex: 1;
  background-color: #D7C1AB;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-horizontal: 16px;
  padding-top: 10px;
  margin-bottom: 30px;
`;

const OwlReadsTitle = styled.Text`
  color: #230109;
  font-family: "Marck Script-Regular";
  font-size: 30px;
  text-align: center;
`;

const SectionCard = styled.View`
  background-color: #FDF5E2;
  margin-horizontal: 20px;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  elevation: 4;
`;

const Label = styled.Text`
  font-family: "VollkornSC-Bold";
  font-size: 18px;
  color: #890524;
  margin-bottom: 10px;
`;

const UidContainer = styled(TouchableOpacity)`
  background-color: #E8DFC9;
  padding: 15px;
  border-radius: 12px;
  align-items: center;
  border: 1px dashed #890524;
`;

const UidText = styled.Text`
  font-family: "Inter-Medium";
  font-size: 18px;
  color: #2F2017;
  letter-spacing: 1px;
`;

// --- СТИЛИ МОДАЛКИ (Оверлей как в библиотеке) ---
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.65);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: #FDF5E2;
  width: 85%;
  border-radius: 30px;
  padding: 25px;
  align-items: center;
  gap: 15px;
`;

const FriendAvatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border-width: 2px;
  border-color: #A28C75;
`;

const FriendName = styled.Text`
  font-family: "VollkornSC-Bold";
  font-size: 22px;
  color: #890524;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-vertical: 10px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: #E8DFC9;
  padding-vertical: 10px;
`;

const StatItem = styled.View`
  align-items: center;
`;

const StatValue = styled.Text`
  font-family: "VollkornSC-Regular";
  font-size: 18px;
  color: #2F2017;
`;

const StatLabel = styled.Text`
  font-family: "Inter-Regular";
  font-size: 10px;
  color: #A28C75;
`;

const OutlinedButton = styled.TouchableOpacity`
  border: 1px solid #6C5141;
  border-radius: 14px;
  padding-vertical: 15px;
  width: 100%;
  align-items: center;
  background-color: #FDF5E2;
`;

const OutlinedButtonText = styled.Text`
  color: #2F2017;
  font-family: "Inter-Regular";
  font-size: 15px;
`;

const DisabledButton = styled.View`
  background-color: #A28C75;
  border-radius: 14px;
  padding-vertical: 15px;
  width: 100%;
  align-items: center;
  opacity: 0.7;
`;

export default function AddFriendScreen({ navigation }) {
  const [myUid, setMyUid] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Состояния для модалки
  const [modalVisible, setModalVisible] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await api.get(`/api/users_personal_data/${userId}/`);
      setMyUid(response.data.uid);
    } catch (error) {
      console.error("Ошибка загрузки своего UID:", error);
    }
  };

  const getAvatarSource = (photo) => {
    if (!photo || photo === 'user_icon') return require("../assets/user_icon.png");
    const preset = AVATAR_PRESETS.find(p => p.id === photo);
    if (preset) return preset.source;
    if (photo.startsWith('/static')) return { uri: `${api.defaults.baseURL}${photo}` };
    return { uri: photo };
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    if (searchQuery.trim() === myUid) {
        Alert.alert("Хм...", "Это ваш собственный ID");
        return;
    }
    
    setLoading(true);
    setRequestSent(false);
    try {
      const userId = await AsyncStorage.getItem('userId');
      // Используем эндпоинт с расширенной инфой
      const response = await api.get(`/api/users_personal_data/search-info/${searchQuery.trim()}`, {
          params: { current_user_id: userId }
      });
      
      setFoundUser(response.data);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Не найдено", "Пользователь с таким ID не существует");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    setActionLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      await api.post(`/api/friends/add/${userId}`, {
        friend_uid: foundUser.uid
      });
      setRequestSent(true);
      // В реальном приложении тут можно обновить статус в foundUser
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось отправить запрос");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    Alert.alert(
        "Удаление",
        `Удалить ${foundUser.username} из друзей?`,
        [
            { text: "Отмена", style: "cancel" },
            { text: "Удалить", style: "destructive", onPress: async () => {
                setActionLoading(true);
                try {
                    const userId = await AsyncStorage.getItem('userId');
                    await api.delete(`/api/friends/${foundUser.friendship_id}/remove/${userId}`);
                    setModalVisible(false);
                    Alert.alert("Успех", "Пользователь удален из друзей");
                } catch (e) {
                    Alert.alert("Ошибка", "Не удалось удалить друга");
                } finally {
                    setActionLoading(false);
                }
            }}
        ]
    );
  };

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require("../assets/chevron_left.png")} style={{ width: 35, height: 35, tintColor: "#230109" }} />
          </TouchableOpacity>
          <OwlReadsTitle>OwlReads</OwlReadsTitle>
          <View style={{ width: 35 }} />
        </Header>

        <SectionCard>
          <Label>Мой уникальный ID</Label>
          <UidContainer onPress={() => {
              Clipboard.setStringAsync(myUid);
              Alert.alert("Скопировано", "Ваш ID скопирован");
          }}>
            <UidText>{myUid || "Загрузка..."}</UidText>
          </UidContainer>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#A28C75", marginTop: 8, textAlign: "center" }}>
            Нажмите на ID, чтобы скопировать его
          </Text>
        </SectionCard>

        <SectionCard>
          <Label>Найти друга</Label>
          <InputField 
            placeholder="Введите owl_..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          <View style={{ marginTop: 15 }}>
            {loading ? (
              <ActivityIndicator color="#890524" />
            ) : (
              <RedButton name="Найти" onPress={handleSearch} />
            )}
          </View>
        </SectionCard>

        {/* --- МОДАЛЬНОЕ ОКНО РЕЗУЛЬТАТА --- */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <Overlay>
              <TouchableWithoutFeedback>
                <ModalContent>
                  <FriendAvatar source={getAvatarSource(foundUser?.profile_photo)} />
                  <FriendName>{foundUser?.username}</FriendName>
                  
                  <StatsRow>
                    <StatItem>
                      <StatValue>{foundUser?.stats.total}</StatValue>
                      <StatLabel>Всего книг</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>{foundUser?.stats.read}</StatValue>
                      <StatLabel>Прочитано</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>{foundUser?.stats.favorites}</StatValue>
                      <StatLabel>Любимых</StatLabel>
                    </StatItem>
                  </StatsRow>

                  {actionLoading ? (
                    <ActivityIndicator color="#890524" />
                  ) : (
                    <>
                      {foundUser?.is_friend ? (
                        <OutlinedButton onPress={handleRemoveFriend}>
                          <OutlinedButtonText>Удалить из друзей</OutlinedButtonText>
                        </OutlinedButton>
                      ) : requestSent ? (
                        <DisabledButton>
                          <OutlinedButtonText style={{ color: "#FDF5E2" }}>Запрос отправлен</OutlinedButtonText>
                        </DisabledButton>
                      ) : (
                        <RedButton 
                          name="Добавить в друзья" 
                          onPress={handleAddFriend} 
                        />
                      )}
                    </>
                  )}

                  <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 5 }}>
                    <Text style={{ fontFamily: "Inter-Regular", color: "#A28C75" }}>Закрыть</Text>
                  </TouchableOpacity>
                </ModalContent>
              </TouchableWithoutFeedback>
            </Overlay>
          </TouchableWithoutFeedback>
        </Modal>

      </SafeAreaView>
    </Container>
  );
}