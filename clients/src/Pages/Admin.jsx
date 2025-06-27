import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { db } from '../Firebase/firebase';
import { IoHome, IoLogOut, IoMoon, IoSunny } from "react-icons/io5";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 92vw;
  height: 90vh;
  margin: 40px auto;
  padding: 20px;
  background: ${props => props.theme.cardBg};
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-family: Inter;
  overflow: auto;
`;

const HeadingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Heading = styled.h2`
  color: ${props => props.theme.heading};
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;

const HomeButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.buttonHover};
  }
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 10px;
    background: ${props => props.theme.inputBg};
    color: #fff;
    border: none;
    border-radius: 6px;
     border: solid 1px ${props => props.theme.text};
  }

  button {
    padding: 10px 16px;
    background: ${props => props.theme.buttonBg};
    border: none;
    border-radius: 6px;
    color: ${props => props.theme.buttonText};
    cursor: pointer;

    &:hover {
      background: ${props => props.theme.buttonHover};
    }
  }
`;

const ListItem = styled.div`
  background: ${props => props.theme.cardBg === '#fff8e1' ? '#f5f5f5' : '#2c2c2c'};
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  gap: 10px;
  align-items: center;

  input {
    flex: 1;
    background: transparent;
    color: #fff;
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

    &.delete {
      background: #e74c3c;
    }
  }
`;

export default function Admin({ toggleTheme, themeMode }) {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [newName, setNewName] = useState('');
  const [editMap, setEditMap] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  const fetchLinks = async () => {
    const querySnapshot = await getDocs(collection(db, 'files'));
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      url: doc.data().url,
      name: doc.data().name || '',
    }));
    setLinks(docs);

    const map = {};
    docs.forEach(link => {
      map[link.id] = { url: link.url, name: link.name };
    });
    setEditMap(map);
  };

  const handleAdd = async () => {
    if (!newLink.trim() || !newName.trim()) return;
    await addDoc(collection(db, 'files'), { url: newLink, name: newName });
    toast.success("Link added successfully");
    setNewLink('');
    setNewName('');
    fetchLinks();
  };

  const handleUpdate = async (id) => {
    const updated = editMap[id];
    const ref = doc(db, 'files', id);
    await updateDoc(ref, { url: updated.url, name: updated.name });
    toast.success("Link updated");
    fetchLinks();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'files', id));
    toast.info("Link deleted");
    fetchLinks();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully");
      navigate('/admin-login');
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <Container>
      <HeadingRow>
        <Heading>🎛️ Admin Panel – Manage Guitar Pro Links</Heading>
        <ButtonGroup>
          <ToggleButton onClick={toggleTheme}>
            {themeMode === 'dark' ? <IoSunny /> : <IoMoon />}
          </ToggleButton>
          <LogoutButton onClick={handleLogout}><IoLogOut /> Logout</LogoutButton>
          <HomeButton onClick={() => { navigate('/') }}><IoHome /> Home</HomeButton>
        </ButtonGroup>
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

      {links.map((item) => (
        <ListItem key={item.id}>
          <input
            value={editMap[item.id]?.url || ''}
            onChange={(e) =>
              setEditMap({
                ...editMap,
                [item.id]: {
                  ...editMap[item.id],
                  url: e.target.value,
                }
              })
            }
          />
          <input
            value={editMap[item.id]?.name || ''}
            onChange={(e) =>
              setEditMap({
                ...editMap,
                [item.id]: {
                  ...editMap[item.id],
                  name: e.target.value,
                }
              })
            }
          />
          <button onClick={() => handleUpdate(item.id)}>Update</button>
          <button className="delete" onClick={() => handleDelete(item.id)}>Delete</button>
        </ListItem>
      ))}
    </Container>
  );
}
