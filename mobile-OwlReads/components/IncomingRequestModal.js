import React, { useState, useEffect } from "react";
import { Modal, View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import RedButton from "./Red_button";
import api from "../src/api/client";

const Overlay = styled.View`
  flex: 1; background-color: rgba(0, 0, 0, 0.7);
  justify-content: center; align-items: center;
`;

const ModalContent = styled.View`
  background-color: #FDF5E2; width: 85%; border-radius: 30px;
  padding: 25px; align-items: center; gap: 15px;
  elevation: 20; /* Чтобы было выше всех */
`;

const Avatar = styled.Image`
  width: 110px; height: 110px; border-radius: 55px; border-width: 2px; border-color: #A28C75;
`;

const FriendName = styled.Text`
  font-family: "VollkornSC-Bold"; font-size: 24px; color: #890524;
`;

const StatsRow = styled.View`
  flex-direction: row; justify-content: space-around; width: 100%;
  border-top-width: 1px; border-bottom-width: 1px; border-color: #E8DFC9;
  padding-vertical: 15px; margin-vertical: 5px;
`;

const StatItem = styled.View` align-items: center; `;
const StatValue = styled.Text` font-family: "VollkornSC-Regular"; font-size: 18px; color: #2F2017; `;
const StatLabel = styled.Text` font-family: "Inter-Regular"; font-size: 10px; color: #A28C75; `;

const ButtonRow = styled.View` flex-direction: row; gap: 10px; width: 100%; margin-top: 10px; `;

const DeclineButton = styled.TouchableOpacity`
  flex: 1; border: 1px solid #6C5141; border-radius: 14px;
  padding-vertical: 15px; align-items: center; justify-content: center;
`;

export default function IncomingRequestModal({ visible, request, onRespond }) {
  const [stats, setStats] = useState({ total: 0, read: 0, favorites: 0 });

  // Загружаем статистику того, кто стучится в друзья
  useEffect(() => {
    if (visible && request) {
      api.get(`/api/users_statistics/user/${request.user_id}`)
        .then(res => {
          setStats({
            total: res.data.books_in_library,
            read: res.data.books_read,
            favorites: res.data.books_favorites
          });
        })
        .catch(err => console.log("Ошибка загрузки статы в модалке", err));
    }
  }, [visible, request]);

  if (!request) return null;

  const getAvatar = (photo) => {
    if (!photo || photo === 'user_icon') return require("../assets/user_icon.png");
    if (photo.startsWith('/static')) return { uri: `${api.defaults.baseURL}${photo}` };
    return { uri: photo };
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Overlay>
        <ModalContent>
          <Avatar source={getAvatar(request.profile_photo)} />
          <View style={{alignItems: 'center'}}>
            <FriendName>{request.username}</FriendName>
            <Text style={{fontFamily: 'Inter-Regular', color: '#A28C75'}}>хочет в друзья</Text>
          </View>

          <StatsRow>
            <StatItem>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Всего книг</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.read}</StatValue>
              <StatLabel>Прочитано</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.favorites}</StatValue>
              <StatLabel>Любимых</StatLabel>
            </StatItem>
          </StatsRow>
          
          <ButtonRow>
            <DeclineButton onPress={() => onRespond(request.friendship_id, false)}>
              <Text style={{color: "#2F2017", fontFamily: 'Inter-Medium'}}>Отклонить</Text>
            </DeclineButton>
            <View style={{flex: 1.5}}>
                <RedButton name="Принять" onPress={() => onRespond(request.friendship_id, true)} />
            </View>
          </ButtonRow>
        </ModalContent>
      </Overlay>
    </Modal>
  );
}