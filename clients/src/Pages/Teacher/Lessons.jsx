import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../Components/TeacherNavbar';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { LuListMusic } from "react-icons/lu";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { getStudentsLessonRoute, updateProgress } from '../../Utils/APIRoutes';
import { toast } from 'react-toastify'
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
  align-items: center;

  &:hover {
    transform: scale(1.01);
    border-color: ${({ theme }) => theme.buttonBg};
  }
`;

const LeftSection = styled.div`

`;

const ProgressSection = styled.div`
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  button {
    padding: 2px 6px;
    font-size: 14px;
    cursor: pointer;
  }
`;

const UpdateButton = styled.button`
display: flex;
width: 25px;
height: 25px;
align-items: center;
justify-content: center;
background: none;
border: solid 1px ${({ theme }) => theme.heading};
color: ${({ theme }) => theme.heading};
border-radius: 25px;
outline: none;
`


const PageName = styled.h4`
  color: ${({ theme }) => theme.heading};
  font-size: 16px;
  margin: 0 0 12px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 3px;
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

const MarkButton = styled.button`
  display: flex;
  background: transparent;
  gap : 3px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  border:solid 1px #4caf50 ;
  color: #4caf50;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;

  svg{
    font-size: 15px;
    font-weight: 700;
  }

  &:hover {
    color: #4caf4fd8;
  }
`;

const RemarkButton = styled.button`
    padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  border:solid 1px ${({ theme }) => theme.heading};
  color: ${({ theme }) => theme.heading};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;

  &:hover {
   color: ${({ theme }) => theme.buttonHover};
  }
`

const DropdownWrapper = styled.div`
  position: relative;
`;

const ClassContainer = styled.div`
position: absolute;
 z-index: 9999;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.cardBorder || "#ccc"};
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  gap: 1rem;
  padding: 1rem;
  max-width: 500px;
  min-width: 180px;
  border-radius: 8px;
  margin: 0 auto;
`;


const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.heading};
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  color: ${({ theme }) => theme.buttonBg};
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBg};
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 0.7em;
  cursor: pointer;

  &:hover{
    background: ${({ theme }) => theme.buttonHover};
  }
`


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


export default function Lessons({ themeMode, toggleTheme }) {

  const theme = useTheme();

  const navigate = useNavigate();

  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [openDropdown, setOpenDropdown] = useState({ type: null, index: null });

  /// === RECIEVING STATE FROM HOME PAGE ===///
  const location = useLocation();
  const { studentId } = location.state || {};

  useEffect(() => {

    const teacherToken = localStorage.getItem('teacher-token')
    const teacherData = JSON.parse(localStorage.getItem("guitar-app-teacher"));
    if (!teacherData || !teacherToken) {
      navigate('/teacher-login'); // redirect if not logged in
      return;
    }

    setTeacher(teacherData);

    const fetchLessons = async () => {

      const teacherToken = localStorage.getItem('teacher-token')

      try {
        const res = await api.get(`${getStudentsLessonRoute}/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${teacherToken}`,
            },
          }
        );

        setPages(res.data.lessons);

      } catch (err) {
        console.error('Failed to fetch lessons', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();

  }, [navigate, trigger, studentId]);


  /// === PROGRESS CONTROLLER === //

  const increaseProgress = async (id, value) => {
    setOpenDropdown({ type: null, index: null })
    const progress = Math.min(value + 10, 100);
    const teacherToken = localStorage.getItem('teacher-token');

    const res = await api.post(updateProgress, {
      studentId: studentId,
      lessonId: id,
      progress: progress
    }, {
      headers: {
        Authorization: `Bearer ${teacherToken}`,
      },
    })

    if (res.data.status) {
      setTrigger(!trigger);
    }
  };

  const decreaseProgress = async (id, value) => {

    setOpenDropdown({ type: null, index: null })

    const teacherToken = localStorage.getItem('teacher-token');
    const progress = Math.max(value - 10, 0);

    const res = await api.post(updateProgress, {
      studentId: studentId,
      lessonId: id,
      progress: progress
    }, {
      headers: {
        Authorization: `Bearer ${teacherToken}`,
      },
    })

    if (res.data.status) {
      setTrigger(!trigger);
    }
  };

  return (
    <Container>
      <TeacherNavbar toggleTheme={toggleTheme} themeMode={themeMode} />

      <TopRightActions>
        <ChordButton onClick={() => navigate('/chords')}><LuListMusic /> Guitar Chords</ChordButton>
      </TopRightActions>

      <Heading>Welcome to your Student's lessons</Heading>
      {teacher && <WelcomeText>Hi <strong>{teacher.teachername}</strong>, here are the selected student's lessons:</WelcomeText>}

      {loading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <PageGrid>
          {pages.map((page, idx) => (
            <PageCard key={page._id}>
              <LeftSection>
                <PageName>{page.name}</PageName>
                <CardFooter>
                  <ViewButton onClick={() => navigate(`/player/${page.googleLink}`)}>View</ViewButton>
                  <MarkButton onClick={() => { increaseProgress(page._id, 100) }}>
                    <IoCheckmarkDoneOutline />Mark as Done
                  </MarkButton>
                  <DropdownWrapper>
                    {/* {page.progress === 100 && (
                      <RemarkButton
                        onClick={() =>
                          setOpenDropdown(prev =>
                            prev.type === 'class' && prev.index === idx
                              ? { type: null, index: null }
                              : { type: 'class', index: idx }
                          )
                        }
                      >
                        Add remark
                      </RemarkButton>
                    )} */}
                    {openDropdown.type === 'class' && openDropdown.index === idx && (
                      <ClassContainer>
                        <Input
                          type="text"
                          placeholder="Title"
                        />
                        <SubmitButton>Submit</SubmitButton>
                      </ClassContainer>
                    )}
                  </DropdownWrapper>
                </CardFooter>
              </LeftSection>

              <ProgressSection>
                <CircularProgressbar
                  value={page.progress}
                  text={`${page.progress}%`}
                  styles={buildStyles({
                    textSize: '25px',
                    pathColor: `#4caf50`,
                    textColor: theme.text,
                    trailColor: '#eee',
                  })}
                />
                <ControlButtons>
                  <UpdateButton onClick={() => { decreaseProgress(page._id, page.progress) }}>-</UpdateButton>
                  <UpdateButton onClick={() => { increaseProgress(page._id, page.progress) }}>+</UpdateButton>
                </ControlButtons>
              </ProgressSection>
            </PageCard>
          ))}
        </PageGrid>
      )}
    </Container>
  );


}
