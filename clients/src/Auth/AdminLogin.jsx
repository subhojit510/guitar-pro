import React, { useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoHome, IoLogIn } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";

// Styled Components
const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 40px;
  background: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};
  border-radius: 12px;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h2`
  color: ${props => props.theme.heading};
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-radius: 6px;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};

  &::placeholder {
    color: ${props => props.theme.placeholder};
  }
`;

const Button = styled.button`
  margin-top: 1em;
  width: 100%;
  padding: 12px;
  background: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.buttonHover};
  }
`;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      navigate('/admin');
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  return (
    <Container>
      <Title><GrUserAdmin/> Admin Login </Title>
      <Input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}><IoLogIn /> Login</Button>
      <Button onClick={() => { navigate('/') }}><IoHome /> Home</Button>
    </Container>
  );
}
