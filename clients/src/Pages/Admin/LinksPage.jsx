import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import AdminNavbar from '../../Components/AdminNavbar';
import { GiGuitar } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { addLinkRoute, addTeacherRoute, addUserRoute, deleteLinkRoute, getLinksRoute, updateLinkRoute } from '../../Utils/APIRoutes';
import { IoAdd, IoClose } from 'react-icons/io5';
import api from '../../Utils/api';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};
  font-family: Inter;
    @media (max-width: 768px) {
    padding: 20px 15px;
    height: auto;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2em 1em;
`

const HeadingRow = styled.div`
  display: flex;
  padding: 1em;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1em;
`

const Heading = styled.h2`
  color: ${props => props.theme.heading};
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  input {
    flex: 1 1 250px;
    min-width: 0;
    padding: 10px;
    background: ${props => props.theme.inputBg};
    color: ${props => props.theme.heading};
    border: solid 1px ${props => props.theme.text};
    border-radius: 6px;
  }

  button {
    padding: 10px 16px;
    background: ${props => props.theme.buttonBg};
    border: none;
    border-radius: 6px;
    color: ${props => props.theme.buttonText};
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      background: ${props => props.theme.buttonHover};
    }
  }

  @media (max-width: 500px) {
    flex-direction: column;

    input, button {
     width: 100%;
        padding: 10px 0px;
        max-height: 44px;
    }
  }
`;


const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  max-height:500px;
  overflow: auto;
`

const ListItem = styled.div`
  background: ${props => props.theme.background};
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  input {
    flex: 1 1 200px;
    min-width: 0;
    background: transparent;
    color: ${props => props.theme.text};
    border: none;
    outline: none;
    padding-right: 10px;
  }

  button {
    background: ${props => props.theme.buttonBg};
    border: none;
    padding: 6px 12px;
    color: ${props => props.theme.buttonText};
    border-radius: 4px;
    cursor: pointer;
    flex-shrink: 0;

    &.delete {
      background: #e74c3c;
      color: white;
    }

    &:hover {
      opacity: 0.9;
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;

    input, button {
      width: 100%;
        padding: 10px 0px;
        max-height: 44px;
    }

    button {
      margin-top: 5px;
    }
  }
`;



const AddUserButton = styled.button`
  padding: 8px 16px;
  display: flex;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 6px;
  cursor: pointer;

  svg{
    font-size: 15px;
  }

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;

/// === USER FORM CONTAINER === ///
const UserFormPopup = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 20px;
  z-index: 999;
  width: 300px;
  max-width: 90vw;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);

  h3 {
    margin-top: 0;
    color: ${({ theme }) => theme.heading};
  }

  input {
    width: 98%;
    margin-bottom: 10px;
    padding: 13px 2px;
    background: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.text};
    border-radius: 6px;
  }

  button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background: ${({ theme }) => theme.buttonBg};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.buttonHover};
    }
  }

  .close {
    position: absolute;
    top: 0em;
    width: 1px;
    height: 1px;
    right: 26px;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.text};
    cursor: pointer;

    &:hover {
      color: red;
      background: transparent;
    }

    @media (max-width: 400px) {
      left: 130px;
    }
  }
`;



export default function LinksPage({ toggleTheme, themeMode }) {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [newName, setNewName] = useState('');
  const [editMap, setEditMap] = useState({});
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teacherName, setTeachername] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');

  const navigate = useNavigate();



  const handleAdd = async () => {
    const adminToken = localStorage.getItem('admin-token');
    if (!newLink || !newName) {
      return toast.warning("Please fill in both name and link.");
    }
    const res = await api.post(addLinkRoute, {
      newLink, newName
    },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
    if (res.data.status) {
      toast.success("Link added")
      setNewLink('')
      setNewName('')
      fetchLinks();
    } else {
      toast.error(res.data.msg || "Failed to add link")
    }
  };


  const handleUpdate = async (id) => {
    const adminToken = localStorage.getItem('admin-token');
    const updated = editMap[id];
    if (!updated?.googleLink || !updated?.name) {
      return toast.warning("Both fields are required.");
    }

    try {
      const res = await api.post(updateLinkRoute, {
        id,
        googleLink: updated.googleLink,
        name: updated.name
      },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.status) {
        toast.success("Link updated successfully");
        fetchLinks(); // Refresh the list
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Error updating link");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const adminToken = localStorage.getItem('admin-token')
    try {
      const res = await api.post(deleteLinkRoute, { id }
        , {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      )
      if (res.data.status) {
        toast.success("Link deleted successfully")
        fetchLinks();
      } else {
        toast.error("Failed to delete link")
      }
    } catch (err) {
      toast.error("Error deleting the link");
      console.log(err);
    }
  };

  //// ==== FUNCTION TO HANDLE CONTAINER TOGGLE === ///

  const handleTeacherClick = () => {
    setShowAddTeacherForm(!showAddTeacherForm)
    setShowAddUserForm(false)
  }
  const handleUserClick = () => {
    setShowAddUserForm(!showAddUserForm)
    setShowAddTeacherForm(false)
  }

  /// === FUNCTION TO HANDLE ADDING USER === ///

  const handleAddUser = async () => {
    const adminToken = localStorage.getItem('admin-token')
    if (!newUserEmail || !newUserPassword || !username || !userId) {
      toast.warning("User, Email and password are required.");
      return;
    }
    if (userId.length !== 6) {
      toast.info("Length of userId should be 6");
      return
    }

    try {
      const res = await api.post(addUserRoute, {
        userId: userId,
        username: username,
        email: newUserEmail,
        password: newUserPassword
      },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

      if (res.data.status) {
        toast.success("User added successfully!");
        setNewUserEmail('');
        setNewUserPassword('');
        setUserId('');
        setUsername('');
        setShowAddUserForm(false)
      } else {
        toast.error(res.data.msg || "Failed to add user.");
      }
    } catch (err) {
      toast.error("Error adding user.");
      setNewUserEmail('');
      setNewUserPassword('');
      setUserId('');
      setUsername('');
      console.error(err);
    }
  };

  /// === FUNCTION TO HANDLE ADDING TEACHER === ///

  const handleAddTeacher = async () => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }
    if (!newTeacherEmail || !newTeacherPassword || !teacherName || !teacherId) {
      toast.warning("Teacher's Id, Email and password are required.");
      return;
    }
    if (teacherId.length !== 6) {
      toast.info("Length of Teacher's Id should be 6");
      return
    }

    try {
      const res = await api.post(addTeacherRoute, {
        teacherId: teacherId,
        teacherName: teacherName,
        email: newTeacherEmail,
        password: newTeacherPassword
      },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          },
        });

      if (res.data.status) {
        toast.success("Teacher added successfully!");
        setNewTeacherEmail('');
        setNewTeacherPassword('');
        setTeacherId('');
        setTeachername('');
        setShowAddTeacherForm(false)
      } else {
        toast.error(res.data.msg || "Failed to add teacher.");
      }
    } catch (err) {
      toast.error("Error adding teacher.");
      setNewTeacherEmail('');
      setNewTeacherPassword('');
      setTeacherId('');
      setTeachername('');
      console.error(err);
    }
  };


  const fetchLinks = async () => {
    const adminToken = localStorage.getItem('admin-token');

    if (!adminToken) {
      navigate('/admin-login');
      return;
    }
    const res = await api.get(getLinksRoute, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    if (res.data.status) {
      setLinks(res.data.pages);

      // 🛠️ Initialize editMap with fetched data
      const initialMap = {};
      res.data.pages.forEach(link => {
        initialMap[link._id] = {
          googleLink: link.googleLink,
          name: link.name
        };
      });
      setEditMap(initialMap);
    } else {
      toast.error("Failed to fetch links");
    }
  };



  useEffect(() => {


    fetchLinks();

  }, [navigate]);

  return (

    <Container>
      <AdminNavbar toggleTheme={toggleTheme} themeMode={themeMode} />
      <Section>
        <HeadingRow>
          <Heading><GiGuitar />Manage Guitar Pro Links</Heading>
          <ButtonSection>
            <AddUserButton onClick={handleUserClick}>
              <IoAdd /> Add User
            </AddUserButton>
            <AddUserButton onClick={handleTeacherClick}>
              <IoAdd /> Add Teacher
            </AddUserButton></ButtonSection>

        </HeadingRow>

        <InputRow>
          <input
            type="text"
            value={newLink}
            placeholder="Enter Google Drive File ID"
            onChange={e => setNewLink(e.target.value)}
          />
          <input
            type="text"
            value={newName}
            placeholder="Enter Page Name"
            onChange={e => setNewName(e.target.value)}
          />
          <button onClick={handleAdd}>Add</button>
        </InputRow>

        <ListSection> {links.map((item) => (
          <ListItem key={item._id}>
            <input
              value={editMap[item._id]?.googleLink || ''}
              onChange={(e) =>
                setEditMap({
                  ...editMap,
                  [item._id]: {
                    ...editMap[item._id],
                    googleLink: e.target.value,
                  }
                })
              }
            />
            <input
              value={editMap[item._id]?.name || ''}
              onChange={(e) =>
                setEditMap({
                  ...editMap,
                  [item._id]: {
                    ...editMap[item._id],
                    name: e.target.value,
                  }
                })
              }
            />
            <button onClick={() => handleUpdate(item._id)}>Update</button>
            <button className="delete" onClick={() => handleDelete(item._id)}>Delete</button>
          </ListItem>
        ))}</ListSection>

        {showAddUserForm && (
          <UserFormPopup>
            <button className="close" onClick={() => { setShowAddUserForm(false) }}><IoClose /></button>
            <h3>Create New User</h3>
            <input
              type="text"
              placeholder="UserId"
              value={userId}
              onChange={e => setUserId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUserPassword}
              onChange={e => setNewUserPassword(e.target.value)}
            />
            <button onClick={handleAddUser}>Add</button>
          </UserFormPopup>
        )}
        {showAddTeacherForm && (
          <UserFormPopup>
            <button className="close" onClick={() => setShowAddTeacherForm(false)}><IoClose /></button>
            <h3>Create New Teacher</h3>
            <input
              type="text"
              placeholder="TeacherId"
              value={teacherId}
              onChange={e => setTeacherId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Teacher Name"
              value={teacherName}
              onChange={e => setTeachername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={newTeacherEmail}
              onChange={e => setNewTeacherEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={newTeacherPassword}
              onChange={e => setNewTeacherPassword(e.target.value)}
            />
            <button onClick={handleAddTeacher}>Add</button>
          </UserFormPopup>
        )}
      </Section>



    </Container>
  );
}
