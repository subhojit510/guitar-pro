import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../Utils/api';
import { useNavigate } from 'react-router-dom';
import { getUserPagesRoute } from '../Utils/APIRoutes';
import UserNavbar from '../Components/UserNavbar';
import { LuListMusic } from "react-icons/lu";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow: auto;
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-family: 'Inter', sans-serif;
`;

/// === SPINNER ANIMATION === //
const SpinnerWrapper = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.buttonBg};
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Heading = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.heading};
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const PageGrid = styled.div`
  display: grid;
  padding: 1em;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const PageCard = styled.div`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 10px;
  padding: 1rem 1.2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: scale(1.01);
    border-color: ${({ theme }) => theme.buttonBg};
  }
`;

const PageName = styled.h4`
  color: ${({ theme }) => theme.heading};
  font-size: 16px;
  margin: 0 0 12px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ViewButton = styled.button`
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;


const WelcomeText = styled.p`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;
const TopRightActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 2rem 0 0;
`;

const ChordButton = styled.button`
display: flex;
gap: 3px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;


export default function UserHome({ themeMode, toggleTheme }) {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const userToken = localStorage.getItem('user-token')
    const userData = JSON.parse(localStorage.getItem("guitar-app-user"));
    if (!userToken || !userData) {
      navigate('/user-login'); // redirect if not logged in
      return;
    }

    setUser(userData);

    const fetchPages = async () => {
      const userToken = localStorage.getItem('user-token')
      try {
        const res = await api.get(`${getUserPagesRoute}/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setPages(res.data.pages);
      } catch (err) {
        console.error('Failed to fetch user pages', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();

  }, [navigate]);

  return (
    <Container>
      <UserNavbar toggleTheme={toggleTheme} themeMode={themeMode} />

      <TopRightActions>
        <ChordButton onClick={() => navigate('/chords')}><LuListMusic /> Guitar Chords</ChordButton>
      </TopRightActions>

      <Heading>Welcome to Guitarature lessons</Heading>
      {user && <WelcomeText>Hi <strong>{user.username}</strong>, here are your available pages:</WelcomeText>}

      {loading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <PageGrid>
          {pages.map((page) => (
            <PageCard key={page._id}>
              <PageName>{page.name}</PageName>
              <CardFooter>
                <ViewButton onClick={() => navigate(`/player/${page.googleLink}`)}>View</ViewButton>
              </CardFooter>
            </PageCard>
          ))}
        </PageGrid>
      )}
    </Container>
  );


}
