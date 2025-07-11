import React from 'react';
import styled from 'styled-components';

const Dot = styled.div`
  width: 15px;
  height: 15px;
  background-color: orange;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NoteDot = () => <Dot />;

export default NoteDot;
