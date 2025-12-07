// components/Tab_bar.js
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  height: 48px;
  width: 100%;
  position: absolute;
  bottom: 0px;
`;

export const TabBar = ({color}) => {
  return (
    <Container 
      style={{ backgroundColor: color }}
    />
  );
};

