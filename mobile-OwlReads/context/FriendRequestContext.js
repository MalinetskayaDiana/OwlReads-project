import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../src/api/client';
import IncomingRequestModal from '../components/IncomingRequestModal';

const FriendRequestContext = createContext();

export const FriendRequestProvider = ({ children }) => {
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const checkRequests = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await api.get(`/api/friends/pending/${userId}`);
      
      // Если есть заявки и мы сейчас не показываем окно
      if (response.data.length > 0 && !isModalVisible) {
        setIncomingRequest(response.data[0]);
        setModalVisible(true);
      }
    } catch (e) {
      console.error("Ошибка фоновой проверки заявок", e);
    }
  };

  useEffect(() => {
    // Проверяем каждые 10 секунд
    const interval = setInterval(checkRequests, 10000);
    return () => clearInterval(interval);
  }, [isModalVisible]);

  const handleRespond = async (fId, accept) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await api.post(`/api/friends/respond/${fId}`, null, {
        params: { user_id: userId, accept: accept }
      });
      setModalVisible(false);
      setIncomingRequest(null);
      if (accept) Alert.alert("Успех", "Теперь вы друзья!");
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось ответить на запрос");
    }
  };

  return (
    <FriendRequestContext.Provider value={{ checkRequests }}>
      {children}
      {/* Модалка рендерится здесь, поэтому она будет видна поверх любого экрана */}
      <IncomingRequestModal 
        visible={isModalVisible}
        request={incomingRequest}
        onRespond={handleRespond}
      />
    </FriendRequestContext.Provider>
  );
};

export const useFriendRequest = () => useContext(FriendRequestContext);