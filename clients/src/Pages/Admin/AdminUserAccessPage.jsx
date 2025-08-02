import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaCheckCircle, FaUsers } from "react-icons/fa";
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

const GreenDot = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  color: green;
  font-size: 18px;
`;

export default function AdminUserAccess({ themeMode, toggleTheme }) {
  const [users, setUsers] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [pageName, setPageName] = useState('');
  const navigate = useNavigate();
  const { pageId } = useParams();

  const adminToken = localStorage.getItem("admin-token");
  useEffect(() => {

    if (!adminToken) {
      navigate("/admin-login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get(getUsersRoute, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setUsers(userRes.data.users);

        const pageRes = await axios.get(`${getSinglePageRoute}/${pageId}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setPageName(pageRes.data.page.name)
        setAccessList(pageRes.data.page.userAccess || []);
      } catch (err) {
        toast.error("Error loading data");
        console.error(err);
      }
    };

    fetchData();
  }, [navigate, pageId]);

  const handleAuthorize = async (userId) => {
    const adminToken = localStorage.getItem('admin-token');
    try {
      const res = await axios.post(authorizeUserRoute,
        {
          pageId, userId

        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
      if (res.data.status) {
        toast.success("User authorized");
        setAccessList((prev) => [...prev, userId]);
      } else toast.error("Authorization failed");
    } catch (err) {
      toast.error("Error authorizing");
    }
  };

  const handleRemove = async (userId) => {
    const adminToken = localStorage.getItem('admin-token')
    try {
      const res = await axios.post(removeUserAccessRoute, {
        pageId, userId
      },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
      if (res.data.status) {
        toast.success(res.data.msg);
        setAccessList((prev) => prev.filter((id) => id !== userId));
      } else toast.error("Failed to remove access");
    } catch (err) {
      toast.error("Error removing access");
    }
  };

  return (
    <Container>
      <AdminNavbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <Title><FaUsers /> User Access for: {pageName}</Title>
      <CardGrid>
        {users.map((user, idx) => {
          const hasAccess = accessList.includes(user.userId);
          return (
            <UserCard key={user._id}>
              {hasAccess && <GreenDot><FaCheckCircle /></GreenDot>}
              <Info><Label>#</Label><Value>{idx + 1}</Value></Info>
              <Info><Label>Name:</Label><Value>{user.username}</Value></Info>
              <Info><Label>User ID:</Label><Value>{user.userId}</Value></Info>
              <Info><Label>Email:</Label><Value>{user.email}</Value></Info>
              <Info><Label>Role:</Label><Value>{user.role || "user"}</Value></Info>
              <ButtonRow>
                {!hasAccess ? (
                  <ActionBtn bg="#10b981" onClick={() => handleAuthorize(user.userId)}>Authorize Access</ActionBtn>
                ) : (
                  <ActionBtn bg="#f43f5e" onClick={() => handleRemove(user.userId)}>Remove Access</ActionBtn>
                )}
              </ButtonRow>
            </UserCard>
          );
        })}
      </CardGrid>
    </Container>
  );
}
