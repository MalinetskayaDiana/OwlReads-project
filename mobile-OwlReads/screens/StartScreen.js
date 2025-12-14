import React from "react";
import { View, Image} from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import RedButton from "../components/Red_button";

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

const Buttons = styled.View`
  margin-top: auto;
  margin-bottom: 60px;
  gap: 10px;
  align-items: center;
  width: auto;
  flex-direction: column;
  justify-content: center;
  width: auto;
  margin-left: 32px;
  margin-right: 32px;
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: #D7C1AB;
  border: 1px solid #6C5141;
  border-radius: 14px;
  padding-vertical: 20px;
  margin-horizontal: 32px;
  align-items: center;
  justify-content: center;
  shadow-color: #230109;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;

  elevation: 6;
  width: 100%;
`;

const ButtonText = styled.Text`
  color: #2F2017;
  font-family: "Inter-Regular";
  font-size: 15px;
  text-align: center;
`;

const OwlImage = styled.Image`
  width: 242px;
  height: 293px;
  align-self: center;
  bottom: 240px;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

export default function StartScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#D7C1AB", flexDirection: "column"}}>
      <View style={{top: 100}}>
        <OwlReadsTitle>OwlReads</OwlReadsTitle>
        <OwlReadsSubTitle>Начни свою {"\n"} книжную историю!</OwlReadsSubTitle>
      </View>

      <OwlImage source={require("../assets/Owl.png")}/>
      <Buttons>
        <RedButton screen={"Registration"} name={"Зарегистрироваться"}/>

        <ButtonContainer onPress={() => navigation.navigate("Entry")}>
          <ButtonText>Продолжить чтение</ButtonText>
        </ButtonContainer>
      </Buttons>     
    </View>
  );
}