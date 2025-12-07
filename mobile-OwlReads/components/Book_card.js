// components/Book_card.js
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, View } from 'react-native';
import { TextBox } from './TextBox_props';
import RatingStars from './Rating_starts';

const CardContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 12px;
  border-radius: 20px;
  background-color: rgba(253, 245, 226, 0.7);
  padding: 12px;
  shadow-color: #A28C75;
  shadow-offset: 1px 2px;
  shadow-opacity: 0.8;
  shadow-radius: 4px;
  margin-bottom: 10px; 
`;

const CoverImage = styled.Image`
  height: ${({ height }) => height || 160}px;
  width: ${({ width }) => width || 110}px;
  border-radius: 7px;
`;

const InfoBlock = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 10px;
  justify-content: flex-start;
`;

const TitleText = styled.Text`
  font-family: VollkornSC-Regular;
  font-size: 15px;
  color: #890524;
  margin-top: 6px;
`;

const AuthorText = styled.Text`
  font-family: Inter-Regular;
  font-size: 13px;
  color: #2F2017;
  margin-top: 4px;
`;

export const BookCard = ({
  cover,
  category,
  categorycolor,
  title,
  author,
  rating,
  onPress,
}) => {
  return (
    <CardContainer onPress={onPress}>
      <CoverImage source={cover} resizeMode="cover" />
      <InfoBlock>
        <View style={{ alignSelf: 'flex-end' }}>
          <TextBox text={category} color={categorycolor}/>
        </View>
       
        <TitleText>{title}</TitleText>
        <AuthorText>{author}</AuthorText>
        <RatingStars
          rating={rating}
          size={40}
          filledImage={require('../assets/star_filled.png')}
          emptyImage={require('../assets/star_empty.png')}
        />
      </InfoBlock>
    </CardContainer>
  );
};
