// Same imports as before
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import {
  getTeachersRoute,
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


// Component
export default function AllTeachers({ themeMode, toggleTheme }) {

  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }

    const fetchTeachers = async () => {
      try {
        const res = await api.get(getTeachersRoute, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setTeachers(res.data.teachers);
      } catch (err) {
        toast.error("Error loading users");
        console.error(err);
      }
    };


    fetchTeachers();

  }, [navigate]);

  const handleDeleteTeacher = async (userId) => {
    try {
      // delete logic here
    } catch (err) {
      toast.error("Error deleting user");
    }
  };



  return (
    <Container>
      <AdminNavbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <Title><MdManageAccounts /> Manage Teachers</Title>
      <CardGrid>
        {teachers.map((teacher, idx) => (
          <UserCard key={teacher._id}>
            <Info><Label>#</Label><Value>{idx + 1}</Value></Info>
            <Info><Label>Name:</Label><Value>{teacher.name}</Value></Info>
            <Info><Label>User ID:</Label><Value>{teacher.teacherId}</Value></Info>
            <Info><Label>Email:</Label><Value>{teacher.email}</Value></Info>
            <Info><Label>Role:</Label><Value>{teacher.role || "user"}</Value></Info>
            <ButtonRow>
              <ActionBtn onClick={() => handleDeleteTeacher(teacher.teacherId)}>
                <FaTrash style={{ marginRight: "5px" }} /> Delete
              </ActionBtn>
            </ButtonRow>
          </UserCard>
        ))}
      </CardGrid>
    </Container>
  );
}
