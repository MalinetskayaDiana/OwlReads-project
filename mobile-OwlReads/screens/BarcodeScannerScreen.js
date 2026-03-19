import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native"; // Добавили useRoute
import styled from "styled-components/native";
import api from "../src/api/client";
import RedButton from "../components/Red_button";

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  padding-vertical: 60px;
  align-items: center;
`;

const ScanArea = styled.View`
  width: 280px;
  height: 200px;
  border-width: 2px;
  border-color: ${(props) => (props.active ? "#890524" : "#fdf5e2")};
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
  const [tempCode, setTempCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Получаем режим работы сканера (по умолчанию "search")
  // "search" - переход на страницу поиска
  // "fill" - просто возврат кода в форму добавления
  const mode = route.params?.mode || "search"; 

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

  const handleBarcodeDetection = ({ data }) => {
    if (data !== tempCode) {
      setTempCode(data);
    }
  };

  // ИЗМЕНЕННАЯ ЛОГИКА НАЖАТИЯ
  const handleActionPress = async () => {
    if (!tempCode) {
      Alert.alert("Внимание", "Пожалуйста, наведите камеру на штрихкод");
      return;
    }

    if (mode === "fill") {
      // ПУНКТ 3: Если мы пришли из формы добавления, просто возвращаемся назад с кодом
      navigation.navigate("BookManualAdd", { scannedIsbn: tempCode });
    } else {
      // ПУНКТ 2: Переходим на экран поиска и передаем туда ISBN
      // Логику "если не найдено - на добавление" мы пропишем в самом экране поиска
      navigation.navigate("BookSearch", { initialQuery: tempCode });
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
                // Меняем текст в зависимости от режима
                name={mode === "fill" ? "Вставить в форму" : "Найти книгу"} 
                onPress={handleActionPress} 
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