import React, { useState } from 'react';
import styled from 'styled-components';
import {signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom'; // Needed for redirection
import { toast } from 'react-toastify';

// Styled Components
const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 40px;
  background: #1e1e1e;
  color: #f4f4f4;
  border-radius: 12px;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h2`
  color: #00d1b2;
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-radius: 6px;
  background: #2a2a2a;
  color: #fff;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #00d1b2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #00b89c;
  }
`;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // For redirection

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      navigate('/admin'); // Redirect to admin panel
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  return (
    <Container>
      <Title>🔐 Admin Login</Title>
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
      <Button onClick={handleLogin}>Login</Button>
    </Container>
  );
}
