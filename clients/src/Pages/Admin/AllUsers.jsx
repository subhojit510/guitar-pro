// Same imports as before
import React, { useEffect, useState, forwardRef} from "react";
import styled from "styled-components";
import { FaUsers, FaTrash, FaCheck, FaPlus, FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";
import { MdOutlinePlayLesson } from "react-icons/md";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import api from "../../Utils/api";

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
  gap: 3px;
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
display: flex;
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
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
`;

const IconButton = styled.button`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.cardBorder || "#ccc"};
  border-radius: 8px;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};

  &:hover {
    background-color: ${({ theme }) => theme.hoverBg || "#f0f0f0"};
  }
`;

// Component



const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <IconButton onClick={onClick} ref={ref}>
    <FaCalendarAlt />
    {value || "Select date & time"}
  </IconButton>
));
export default function AllUsers({ themeMode, toggleTheme }) {

  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState({ type: null, index: null });
  const [trigger, setTrigger] = useState(false);
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const userRes = await api.get(getUsersRoute, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setUsers(userRes.data.users);
      } catch (err) {
        toast.error("Error loading users");
        console.error(err);
      }
    };

    const fetchPages = async () => {
      try {
        const res = await api.get(getPagesRoute, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setPages(res.data.pages);
      } catch (err) {
        toast.error("Error loading pages");
        console.error(err);
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await api.get(getTeachersRoute, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          },
        })
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
    const adminToken = localStorage.getItem('admin-token')
    if (hasAccess) {
      await api.post(removeUserAccessRoute, {
        pageId,
        userId
      },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      setTrigger(!trigger)
    } else {
      await api.post(authorizeUserRoute, {
        pageId,
        userId
      },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      setTrigger(!trigger)
    }

  };

  const toggleUserOnTeacher = async (teacherId, userId, hasAccess) => {
    const adminToken = localStorage.getItem('admin-token')
    if (hasAccess) {
      await api.post(unAssignTeacherRoute, {
        teacherId,
        userId
      },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          },
        })
      setTrigger(!trigger)
    } else {
      await api.post(assignTeacherRoute, {
        teacherId,
        userId
      },
        {

          headers: {
            Authorization: `Bearer ${adminToken}`,
          },

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

              <DropdownWrapper>
                <ToggleBtn
                  onClick={() =>
                    setOpenDropdown(prev =>
                      prev.type === 'class' && prev.index === idx
                        ? { type: null, index: null }
                        : { type: 'class', index: idx }
                    )
                  }
                >
                  <FaChalkboardTeacher /> Schedule class
                </ToggleBtn>

                {openDropdown.type === 'class' && openDropdown.index === idx && (
                  <ClassContainer>
                    <Input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                     <StyledDatePicker
         selected={dateTime}
        onChange={(date) => setDateTime(date)}
        showTimeSelect
        dateFormat="Pp"
        timeFormat="HH:mm"
        timeIntervals={15}
        customInput={<CustomDateInput />}
      />
                  </ClassContainer>
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
