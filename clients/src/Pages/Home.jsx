import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import api from '../Utils/api';
import { useNavigate } from 'react-router-dom';
import { getUserPagesRoute } from '../Utils/APIRoutes';
import UserNavbar from '../Components/UserNavbar';
import { LuListMusic } from "react-icons/lu";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

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
  text-align: start;
  color: ${({ theme }) => theme.heading};
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2rem;
`;

const PageGrid = styled.div`
  overflow: auto;
  max-height: 500px;
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
  justify-content: space-between;
  overflow-wrap: break-word;

  &:hover {
    transform: scale(1.01);
    border-color: ${({ theme }) => theme.buttonBg};
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
  align-items: flex-start;
  overflow-wrap: break-word;
`

const PageName = styled.h4`
  color: ${({ theme }) => theme.heading};
  font-size: 16px;
  margin: 0 0 0px;
`;

const Remark = styled.div`
    font-size: 16px;
  color: #555;  
`
const About = styled.div`
color: ${({ theme }) => theme.heading};
`

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ProgressSection = styled.div`
  min-width: 50px;
  max-width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageProgressSection = styled.div`
  min-width: 50px;
  max-width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const TopLeftActions = styled.div`
  display: flex;
  box-shadow: 0px 0px 6px #ab47bc, 0 1px 3px rgba(0, 0, 0, 0.08);
  background: ${({ theme }) => theme.background};
  width: 50%;
  max-width: 362px;
  border-radius: 15px;
  padding: 2em;
  align-items: flex-start;
  color: ${({ theme }) => theme.text};
  gap: 2rem;
  margin: 1em;

@media (max-width: 560px) {
  min-width: 0px;
  width: calc(100% - 3em); 
  margin: 1em;  
  box-sizing: border-box;  
}
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;

`

const NextPayment = styled.div`
  font-size: 16px;
  margin-top: 8px;
  text-align: center;
  color: #555;  
`

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

  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [nextPayment, setNextPayment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const userToken = localStorage.getItem('user-token')
    const userData = JSON.parse(localStorage.getItem("guitar-app-user"));
    if (!userToken || !userData) {
      navigate('/user-login'); // redirect if not logged in
      return;
    }

    setUser(userData);

    const fetchLessons = async () => {
      const userToken = localStorage.getItem('user-token')
      try {
        const res = await api.get(`${getUserPagesRoute}/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setLessons(res.data.lessons);
        setProgress(res.data.avgProgress);
        setNextPayment(res.data.nextPayment)
      } catch (err) {
        console.error('Failed to fetch student lessons', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();

  }, [navigate]);

  return (
    <Container>
      <UserNavbar toggleTheme={toggleTheme} themeMode={themeMode} />

      <TopLeftActions>
        <Contents>
          {user && (
            <WelcomeText>
              Hi <strong>{user.username}</strong>, Welcome to Guitarature
            </WelcomeText>
          )}

          {user && (
            <NextPayment>
              Next Payment: <strong>{nextPayment}</strong>
            </NextPayment>
          )}
        </Contents>


        <ProgressSection style={{ width: '140px', height: '140px' }}>
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: '25px',
              pathColor: `#4caf50`,
              textColor: theme.text,
              trailColor: '#eee',
            })}
          />
        </ProgressSection>
      </TopLeftActions>



      <Heading>Available Lessons<TopRightActions>
        <ChordButton onClick={() => navigate('/chords')}><LuListMusic /> Guitar Chords</ChordButton>
      </TopRightActions></Heading>


      {loading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <PageGrid>
          {lessons.map((lesson) => (
            <PageCard key={lesson.lessonDetails._id} onClick={() => navigate(`/player/${lesson.lessonDetails.googleLink}`)}>
              <LeftSection>
                <PageName>{lesson.lessonDetails.name}</PageName>
                <Remark>Teacher remark: {lesson.teacherRemark}</Remark>
                <About>About the lesson: {lesson.lessonDetails.about}</About>
                <CardFooter>
                </CardFooter>
              </LeftSection>
              <PageProgressSection>
                <CircularProgressbar
                  value={lesson.progress}
                  text={`${lesson.progress}%`}
                  styles={buildStyles({
                    textSize: '25px',
                    pathColor: `#4caf50`,
                    textColor: theme.text,
                    trailColor: '#eee',
                  })}
                />
              </PageProgressSection>

            </PageCard>
          ))}
        </PageGrid>
      )}
    </Container>
  );

}
