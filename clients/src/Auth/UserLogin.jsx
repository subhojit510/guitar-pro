import React, { useState } from 'react';
import styled from 'styled-components';
import { userLoginRoute } from '../Utils/APIRoutes';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

/// === STYLED COMPONENTS === ///
const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background};
  font-family: 'Inter', sans-serif;
  padding: 2rem;
`;

const AuthCard = styled.div`
  background: ${({ theme }) => theme.loginBg};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  text-align: center;
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
const TextLink = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  a {
    color: ${({ theme }) => theme.buttonBg};
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;


const UserLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
  });

  const [user, setUser] = useState(null);

  const login = (userData) => {
    localStorage.setItem('guitar-app-user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(userLoginRoute, { formData });
      if (res.data.status) {
        login(res.data.userfilter);
        setFormData({
          userId: '',
          email: '',
          password: '',
        });
        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error(res.data.msg || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again later.');
    }
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <Title>Student Login</Title>
        <Input
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          type="text"
          placeholder="User ID"
        />
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
        <TextLink onClick={()=>{navigate('/admin-login')}}>
          Are you the admin? <a>Go to Admin Login</a>
        </TextLink>
      </AuthCard>
    </AuthWrapper>
  );
};

export default UserLoginPage;
