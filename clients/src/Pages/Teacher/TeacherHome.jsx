import React, { useEffect, useState } from 'react';
import { useTheme } from "styled-components";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../Components/TeacherNavbar';
import { LuListMusic } from "react-icons/lu";
import { getStudentsRoute } from '../../Utils/APIRoutes';
import { toast } from 'react-toastify';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import api from '../../Utils/api';

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

const LeftSection = styled.div`
  display: flex;
  justify-content: space-between;
`
const ProgressSection = styled.div`
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
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


export default function TeacherHome({ themeMode, toggleTheme }) {

  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const teacherToken = localStorage.getItem('teacher-token')
    const teacherData = JSON.parse(localStorage.getItem('guitar-app-teacher'))
    if (!teacherToken || !teacherData) {
      navigate('/teacher-login'); // redirect if not logged in
      return;
    }

    setTeacher(teacherData);

    const fetchStudents = async () => {
      try {
        const res = await api.get(`${getStudentsRoute}/${teacherData.teacherId}`, {
          headers: {
            Authorization: `Bearer ${teacherToken}`,
          },
        });

        setStudents(res.data.students);

      } catch (err) {
        toast.error(err);
        console.error('Failed to fetch students', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [navigate]);

  // == REDIRECTING TO LESSONS LIST WITH STUDENT ID === ///
  const handleRedirect = (id) => {
    navigate('/teacher/lessons', {
      state: {
        studentId: id
      }
    })
  }


  return (
    <Container>
      <TeacherNavbar toggleTheme={toggleTheme} themeMode={themeMode} />

      <TopRightActions>
        <ChordButton onClick={() => navigate('/chords')}><LuListMusic /> Guitar Chords</ChordButton>
      </TopRightActions>

      <Heading>Teacher Dashboard</Heading>
      {teacher && <WelcomeText>Hi <strong>{teacher.teachername}</strong>, here are your available students:</WelcomeText>}

      {loading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <PageGrid>
          {students.map((student) => (
            <PageCard key={student._id}>
              <LeftSection>
                <PageName>{student.username}</PageName>
                <CardFooter>
                  <ViewButton onClick={() => { handleRedirect(student.userId) }}>View Lessons</ViewButton>
                </CardFooter></LeftSection>
              <ProgressSection>
                <CircularProgressbar
                  value={student.averageProgress}
                  text={`${student.averageProgress}%`}
                  styles={buildStyles({
                    textSize: '25px',
                    pathColor: `#4caf50`,
                    textColor: theme.text,
                    trailColor: '#eee',
                  })}
                />
              </ProgressSection>
            </PageCard>
          ))}
        </PageGrid>
      )}
    </Container>
  );


}
