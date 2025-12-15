import React from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  margin-horizontal: 32px;
  width: 100%;
`;

const Container = styled.View`
  background-color: #E8DFC9;
  border-radius: 14px;
  padding-horizontal: 14px;
  padding-vertical: 7px;
`;

const StyledInput = styled.TextInput`
  font-family: Inter-Regular;
  font-size: 15px;
  color: #2F2017;
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
  secureTextEntry, // <--- Добавить
  keyboardType,    // <--- Добавить (для email и цифр)
  autoCapitalize   // <--- Добавить (чтобы email не был с большой буквы)
}) => {
  return (
    <Wrapper>
      <Container>
        <StyledInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(47, 32, 23, 0.3)"
          secureTextEntry={secureTextEntry} // <--- Использовать
          keyboardType={keyboardType}       // <--- Использовать
          autoCapitalize={autoCapitalize}   // <--- Использовать
        />
      </Container>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Wrapper>
  );
};

export default InputField;