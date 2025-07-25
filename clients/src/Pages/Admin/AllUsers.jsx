// Same imports as before
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaUser, FaUsers, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import {
  getUsersRoute,
  getSinglePageRoute,
  authorizeUserRoute,
  removeUserAccessRoute,
} from "../../Utils/APIRoutes";

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
    transform: scale(1.01);
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
  background: ${({ bg }) => bg || "#333"};

  &:hover {
    opacity: 0.9;
  }
`;

const Dropdown = styled.select`
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.buttonText};
  background: ${({ theme }) => theme.buttonBg};
  appearance: none;

  &:hover {
    opacity: 0.9;
  }
`;

export default function AllUsers({ themeMode, toggleTheme }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("guitar-app-admin");
    if (!admin) {
      navigate("/admin-login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get(getUsersRoute);
        setUsers(userRes.data.users);
      } catch (err) {
        toast.error("Error loading data");
        console.error(err);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    try {
      
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  return (
    <Container>
      <AdminNavbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <Title><FaUsers /> Manage Users</Title>
      <CardGrid>
        {users.map((user, idx) => (
          <UserCard key={user._id}>
            <Info><Label>#</Label><Value>{idx + 1}</Value></Info>
            <Info><Label>Name:</Label><Value>{user.username}</Value></Info>
            <Info><Label>User ID:</Label><Value>{user.userId}</Value></Info>
            <Info><Label>Email:</Label><Value>{user.email}</Value></Info>
            <Info><Label>Role:</Label><Value>{user.role || "user"}</Value></Info>
            <ButtonRow>
              <ActionBtn bg="#ef4444" onClick={() => handleDeleteUser(user.userId)}>
                <FaTrash style={{ marginRight: "5px" }} /> Delete
              </ActionBtn>
              <Dropdown>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="user">User</option>
              </Dropdown>
              <Dropdown>
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </Dropdown>
            </ButtonRow>
          </UserCard>
        ))}
      </CardGrid>
    </Container>
  );
}
