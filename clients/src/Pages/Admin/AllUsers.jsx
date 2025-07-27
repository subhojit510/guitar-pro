// Same imports as before
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaUsers, FaTrash, FaCheck, FaPlus, FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlinePlayLesson } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import {
  getUsersRoute,
  getPagesRoute,
  authorizeUserRoute,
  removeUserAccessRoute,
  getTeachersRoute,
  assignTeacherRoute,
  unAssignTeacherRoute
} from "../../Utils/APIRoutes";

// Styled Components
const Container = styled.div`
  width: 100vw;
  font-family: 'Inter', sans-serif;
  background: ${({ theme }) => theme.cardBg};
  min-height: 100vh;
  color: ${({ theme }) => theme.text};
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 2rem;
  text-align: center;
`;

const CardGrid = styled.div`
  margin: 2em;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const UserCard = styled.div`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.cardBorder || theme.text};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: 0.3s ease;
  position: relative;

  &:hover {
    /* transform: scale(1.01); */
    border-color: ${({ theme }) => theme.buttonBg};
  }
`;

const Info = styled.div`
  margin-bottom: 0.7rem;
  font-size: 15px;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.heading};
`;

const Value = styled.span`
  margin-left: 0.4rem;
  color: ${({ theme }) => theme.text};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 1rem;
  align-items: center;
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.buttonText};
  background: #ef4444;

  &:hover {
    opacity: 0.9;
  }
`;

// Lesson Assignment Styles
const DropdownWrapper = styled.div`
  position: relative;
`;

const ToggleBtn = styled(ActionBtn)`
display: flex;
gap: 3px;
  background: ${({ theme }) => theme.buttonBg};
`;

const LessonList = styled.div`
  position: absolute;
  top: 120%;
  left: 0;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.cardBorder || "#ccc"};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  z-index: 9999;
  min-width: 180px;
  
`;

const LessonItem = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:hover {
    transform: scale(1.01);
  }
`;

// Component
export default function AllUsers({ themeMode, toggleTheme }) {
  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState({ type: null, index: null });
  const [trigger, setTrigger] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("guitar-app-admin");
    if (!admin) {
      navigate("/admin-login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const userRes = await axios.get(getUsersRoute);
        setUsers(userRes.data.users);
      } catch (err) {
        toast.error("Error loading users");
        console.error(err);
      }
    };

    const fetchPages = async () => {
      try {
        const res = await axios.get(getPagesRoute);
        setPages(res.data.pages);
      } catch (err) {
        toast.error("Error loading pages");
        console.error(err);
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await axios.get(getTeachersRoute)
        setTeachers(res.data.teachers);
      } catch (err) {
        console.log("Error loading teachers", err);

      }
    }

    fetchUsers();
    fetchPages();
    fetchTeachers();
  }, [navigate, trigger]);

  const handleDeleteUser = async (userId) => {
    try {
      // delete logic here
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  const toggleUserOnPage = async (pageId, userId, hasAccess) => {
    if (hasAccess) {
      const res = await axios.post(removeUserAccessRoute, {
        pageId,
        userId
      })
      setTrigger(!trigger)
    } else {
      const res = await axios.post(authorizeUserRoute, {
        pageId,
        userId
      })
      setTrigger(!trigger)
    }

  };

  const toggleUserOnTeacher = async (teacherId, userId, hasAccess) => {
    if (hasAccess) {
      const res = await axios.post(unAssignTeacherRoute, {
        teacherId,
        userId
      })
      setTrigger(!trigger)
    } else {
      const res = await axios.post(assignTeacherRoute, {
        teacherId,
        userId
      })
      setTrigger(!trigger)
    }

  };

  return (
    <Container>
      <AdminNavbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <Title><FaUsers /> Manage Students</Title>
      <CardGrid>
        {users.map((user, idx) => (
          <UserCard key={user._id}>
            <Info><Label>#</Label><Value>{idx + 1}</Value></Info>
            <Info><Label>Name:</Label><Value>{user.username}</Value></Info>
            <Info><Label>User ID:</Label><Value>{user.userId}</Value></Info>
            <Info><Label>Email:</Label><Value>{user.email}</Value></Info>
            <Info><Label>Role:</Label><Value>{user.role || "user"}</Value></Info>
            <ButtonRow>
              {/* Lesson Dropdown */}
              <DropdownWrapper>
                <ToggleBtn
                  onClick={() =>
                    setOpenDropdown(prev =>
                      prev.type === 'lesson' && prev.index === idx
                        ? { type: null, index: null }
                        : { type: 'lesson', index: idx }
                    )
                  }
                >
                  <MdOutlinePlayLesson /> Assign Lessons
                </ToggleBtn>

                {openDropdown.type === 'lesson' && openDropdown.index === idx && (
                  <LessonList>
                    {pages.map(page => {
                      const hasAccess = page.userAccess.includes(user.userId);
                      return (
                        <LessonItem
                          key={page._id}
                          onClick={() => toggleUserOnPage(page._id, user.userId, hasAccess)}
                        >
                          <span>{page.name}</span>
                          {hasAccess ? <FaCheck color="green" /> : <FaPlus color="gray" />}
                        </LessonItem>
                      );
                    })}
                  </LessonList>
                )}
              </DropdownWrapper>

              <DropdownWrapper>
                <ToggleBtn
                  onClick={() =>
                    setOpenDropdown(prev =>
                      prev.type === 'teacher' && prev.index === idx
                        ? { type: null, index: null }
                        : { type: 'teacher', index: idx }
                    )
                  }
                >
                  <FaChalkboardTeacher /> Assign Teachers
                </ToggleBtn>

                {openDropdown.type === 'teacher' && openDropdown.index === idx && (
                  <LessonList>
                    {teachers.map(teacher => {
                      const hasAccess = user.teacher === teacher.teacherId;
                      return (
                        <LessonItem
                          key={teacher._id}
                          onClick={() => toggleUserOnTeacher(teacher.teacherId, user.userId, hasAccess)}
                        >
                          <span>{teacher.name}</span>
                          {hasAccess ? <FaCheck color="green" /> : <FaPlus color="gray" />}
                        </LessonItem>
                      );
                    })}
                  </LessonList>
                )}
              </DropdownWrapper>

              <ActionBtn onClick={() => handleDeleteUser(user.userId)}>
                <FaTrash style={{ marginRight: "5px" }} /> Delete
              </ActionBtn>
            </ButtonRow>
          </UserCard>
        ))}
      </CardGrid>
    </Container>
  );
}
