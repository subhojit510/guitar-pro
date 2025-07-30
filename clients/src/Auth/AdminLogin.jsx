import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { adminLoginRoute } from '../Utils/APIRoutes';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PiStudentFill} from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";

/// === STYLED COMPONENTS === ///
const AuthWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/auth-bg.jpg');
    background-size: cover;
    background-position: center;
    filter: blur(8px);
    z-index: 0;
  }

  // Layer above the blurred background
  & > * {
    position: relative;
    z-index: 1;
  }
`;


const AuthCard = styled.div`
  background: ${({ theme }) => theme.loginBg};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.heading};
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 0rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.heading};
  }
`;

const Button = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.9rem;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;
const OutlineButton = styled.button`
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
  padding: 0.9rem;
  font-size: 1rem;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 2px solid ${({ theme }) => theme.text};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.text};
    color: ${({ theme }) => theme.background};
  }
`;


const AuthPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(()=>{
    const admin = localStorage.getItem('admin-token')
    const adminData = JSON.parse(localStorage.getItem('guitar-app-admin'))
    if(admin && adminData) {
      navigate('/admin');
      return;
    }
  })

  const login = (adminData,token) => {
    localStorage.setItem('guitar-app-admin', JSON.stringify(adminData));
    localStorage.setItem('admin-token', token);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(adminLoginRoute, { formData });

      if (res.data.status) {
        const {admin, token} = res.data;
        login(admin, token);
        setFormData({ email: '', password: '' });
        toast.success("Login successful");
        navigate('/admin');
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <Title>Welcome Back</Title>
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
        />
        <Input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
        />
        <Button onClick={handleSubmit}>Login</Button>
        <OutlineButton onClick={() => navigate('/')}><PiStudentFill/>
Go to students page
</OutlineButton>
<OutlineButton onClick={() => navigate('/teacher')}><FaChalkboardTeacher/>
Go to Teachers page
</OutlineButton>
      </AuthCard>
    </AuthWrapper>
  );
};

export default AuthPage;
