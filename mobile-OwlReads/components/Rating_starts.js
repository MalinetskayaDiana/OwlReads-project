// components/Rating_star.js
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

const StarsRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StarImage = styled.Image`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin: 0 2px;
`;

const RatingStars = ({ 
  rating = 0, 
  size = 40, 
  filledImage, 
  emptyImage,
  onRate
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <StarsRow>
      {stars.map((_, index) => {
        const isFilled = index < rating;
        return (
          <TouchableOpacity key={index} onPress={() => onRate && onRate(index + 1)}>
            <StarImage
              source={isFilled ? filledImage : emptyImage}
              size={size}
            />
          </TouchableOpacity>
        );
      })}
    </StarsRow>
  );
};

export default RatingStars;
