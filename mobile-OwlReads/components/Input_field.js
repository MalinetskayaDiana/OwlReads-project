import React from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  width: 100%;
`;

const Container = styled.View`
  background-color: #E8DFC9;
  border-radius: 14px;
  padding-horizontal: 14px;
  /* Убираем фиксированный padding-vertical, если передана высота */
  padding-vertical: ${props => (props.height ? 0 : 7)}px; 
  height: ${props => (props.height ? props.height : 'auto')}px;
  justify-content: center;
`;

const StyledInput = styled.TextInput`
  font-family: Inter-Regular;
  font-size: ${props => (props.fontSize ? props.fontSize : 15)}px;
  color: #2F2017;
  width: 100%;
`;

const ErrorText = styled.Text`
  margin-top: 5px;
  color: #890524;
  font-family: Inter-Regular;
  font-size: 12px;
`;

const InputField = ({ 
  value, 
  onChangeText, 
  placeholder, 
  error, 
  style, 
  containerHeight, // Новый проп
  fontSize,        // Новый проп
  ...props 
}) => {
  return (
    <Wrapper style={style}>
      <Container height={containerHeight}>
        <StyledInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(47, 32, 23, 0.3)"
          fontSize={fontSize}
          {...props}
        />
      </Container>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Wrapper>
  );
};

export default InputField;