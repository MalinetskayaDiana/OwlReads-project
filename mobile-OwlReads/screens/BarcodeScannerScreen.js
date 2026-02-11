import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import api from "../src/api/client";
import RedButton from "../components/Red_button"; // Импортируем твою кнопку

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: space-between; /* Чтобы разнести элементы */
  padding-vertical: 60px;
  align-items: center;
`;

const ScanArea = styled.View`
  width: 280px;
  height: 200px;
  border-width: 2px;
  border-color: ${(props) => (props.active ? "#890524" : "#fdf5e2")}; /* Меняем цвет, если код пойман */
  border-radius: 20px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  left: 20px;
  z-index: 10;
`;

const StatusText = styled.Text`
  color: #fdf5e2;
  font-family: "Inter-Medium";
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

export default function BarcodeScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [tempCode, setTempCode] = useState(null); // Храним код, который "видит" камера сейчас
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", color: "#2F2017" }}>Нужен доступ к камере</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Разрешить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Эта функция срабатывает постоянно, пока камера видит штрихкод
  const handleBarcodeDetection = ({ data }) => {
    if (data !== tempCode) {
      setTempCode(data); // Просто запоминаем код в стейт
    }
  };

  // Эта функция срабатывает при нажатии на КРАСНУЮ КНОПКУ
  const handleSearchPress = async () => {
    if (!tempCode) {
      Alert.alert("Внимание", "Пожалуйста, наведите камеру на штрихкод так, чтобы рамка стала красной");
      return;
    }

    setLoading(true);
    try {
      // Наш новый бэкенд с цепочкой вызовов
      const response = await api.get(`/api/literature/isbn/${tempCode}`);
      navigation.navigate("BookManualAdd", { book: response.data });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Если вообще не нашли — ведем на форму, но подставляем ISBN
        navigation.navigate("BookManualAdd", { 
          book: { isbn: tempCode, title: "", author: "", source: "manual" } 
        });
      } else {
        Alert.alert("Ошибка", "Не удалось связаться с сервером");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()}>
        <Image source={require("../assets/chevron_left.png")} style={{ width: 40, height: 40, tintColor: "#FDF5E2" }} />
      </BackButton>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarcodeDetection}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a"],
        }}
      >
        <Overlay>
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <ScanArea active={!!tempCode}>
               {tempCode && <Image source={require("../assets/search.png")} style={{width: 50, height: 50, tintColor: '#890524', opacity: 1.5}} />}
            </ScanArea>
            <StatusText>
              {tempCode ? `Код обнаружен: ${tempCode}` : "Наведите камеру на штрихкод"}
            </StatusText>
          </View>

          <View style={{ width: '90%', alignItems: 'center', paddingBottom: 20 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#FDF5E2" />
            ) : (
              <RedButton
                name="Распознать книгу" 
                onPress={handleSearchPress} 
              />
            )}
          </View>
        </Overlay>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  button: { backgroundColor: "#890524", padding: 15, borderRadius: 10, alignSelf: "center", marginTop: 20 },
  buttonText: { color: "#FDF5E2", fontWeight: 'bold' }
});