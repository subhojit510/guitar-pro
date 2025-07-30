import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { teacherLoginRoute } from '../Utils/APIRoutes';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

/// === STYLED COMPONENTS === ///
const AuthWrapper = styled.div`
width: 100vw;
  min-height: 100vh;
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

const LinkSection = styled.div`
  display: flex;
  gap: 2em;
  justify-content: center;
  align-items: center;
`
const TextLink = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  text-decoration: underline;
   

  a {
    color: ${({ theme }) => theme.buttonBg};
    font-weight: 500;
    text-decoration: none;
  }
`;


const TeacherLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teacherId: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const teacherToken = localStorage.getItem("teacher-token");
    const teacherData = JSON.parse(localStorage.getItem('guitar-app-teacher'))
    if (teacherToken && teacherData) {
      navigate('/teacher');
      return;
    }
  })
  const login = (teacherData, token) => {
    localStorage.setItem('guitar-app-teacher', JSON.stringify(teacherData));
    localStorage.setItem('teacher-token', token)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(teacherLoginRoute, { formData });
      if (res.data.status) {
        const { teacher, token } = res.data
        login(teacher, token);
        setFormData({
          teacherId: '',
          email: '',
          password: '',
        });
        toast.success('Login successful');
        navigate('/teacher');
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
        <Title>Teacher Login</Title>
        <Input
          name="teacherId"
          value={formData.teacherId}
          onChange={handleChange}
          type="text"
          placeholder="Teacher ID"
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
        <LinkSection>
        <TextLink onClick={() => { navigate('/admin-login') }}>
           <span>Go to Admin Login</span>
        </TextLink>
        <TextLink onClick={() => { navigate('/user-login') }}>
          <span>Go to Student Login</span>
        </TextLink>
        </LinkSection>
        
      </AuthCard>
    </AuthWrapper>
  );
};

export default TeacherLoginPage;
