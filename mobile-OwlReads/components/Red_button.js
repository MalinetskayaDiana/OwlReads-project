import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const GradientWrapper = styled(LinearGradient)`
  border-radius: 14px;
  margin-horizontal: 32px;
  
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;

  elevation: 6;
  width: 100%;
`;

const ButtonContainer = styled(TouchableOpacity)`
  
  padding-vertical: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;

const ButtonText = styled.Text`
  color: #FDF5E2;
  font-family: "Inter-Regular";
  font-size: 15px;
  text-align: center;
`;

export default function RedButton({ screen, name, onPress, params }) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress(); // локальная логика (например setStep)
    } else if (screen) {
      navigation.navigate(screen, params); // переход по навигации
    }
  };

  return (
    <GradientWrapper
      colors={["#890524", "#230109"]}
      locations={[0.17, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <ButtonContainer onPress={handlePress}>
        <ButtonText>{name}</ButtonText>
      </ButtonContainer>
    </GradientWrapper>
  );
}
