import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../Firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import { GiGuitar } from "react-icons/gi";
import {IoMoon, IoSunny } from "react-icons/io5";

const Container = styled.div`
  width: 91vw;
  background: ${({ theme }) => theme.background};
  padding: 30px;
  height: 70vh;
  overflow: auto;
  border-radius: 16px;
  color: ${({ theme }) => theme.text};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2em;
  flex-wrap: wrap;
`;

const Heading = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 25px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-size: 16px;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    transform: scale(1.02);
  }

  svg {
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
  width: 40%;
  padding: 12px;
  border-radius: 20px;
  border: solid 1px #37474F;
  margin-bottom: 20px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 16px;

  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SongItem = styled.li`
  background: ${({ theme }) => theme.cardBg};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.heading};
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.cardBorder};

  &:hover {
    background: ${({ theme }) => theme.buttonBg};
    color: ${({ theme }) => theme.buttonText};
    transform: scale(1.01);
  }
`;

const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 30px;
`;

export default function Home({ toggleTheme, themeMode }) {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'files'));
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Untitled Song',
          url: doc.data().url
        }));
        setSongs(items);
        setFilteredSongs(items);
      } catch (err) {
        console.error("Failed to fetch songs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredSongs(
      songs.filter(song =>
        song.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelect = (song) => {
    navigate(`/player/${song.id}`);
  };

  return (
    <Container>
      <TopSection>
        <Heading><GiGuitar /> Available Songs</Heading>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button onClick={() => navigate('/')}>
            <FaUserShield /> Admin
          </Button>
          <Button onClick={toggleTheme}>
            {themeMode === 'dark' ? <><IoSunny/>Light Mode</> : <><IoMoon/>Dark Mode</>}
          </Button>
        </div>
      </TopSection>

      <SearchInput
        type="text"
        placeholder="Search song..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? (
        <Loading>Loading songs...</Loading>
      ) : (
        <SongList>
          {filteredSongs.length === 0 && <p>No songs found.</p>}
          {filteredSongs.map(song => (
            <SongItem key={song.id} onClick={() => handleSelect(song)}>
              {song.name}
            </SongItem>
          ))}
        </SongList>
      )}
    </Container>
  );
}
