import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GiGuitarHead } from "react-icons/gi";
import { GiGuitar } from "react-icons/gi";
import axios from 'axios';
import { getPagesRoute } from '../../Utils/APIRoutes';
import AdminNavbar from '../../Components/AdminNavbar';

const Container = styled.div`
  width: 100vw;
  background: ${({ theme }) => theme.background};
  height: 100vh;
  overflow: auto;
  color: ${({ theme }) => theme.text};
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

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5em;
  flex-wrap: wrap;
`;

const Heading = styled.h2`
  color: ${({ theme }) => theme.heading};
  margin: 10px 0;
  font-size: 1.8rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
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

  @media (max-width: 600px) {
    width: 90%;
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
  margin-bottom: 15px;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  transition: all 0.3s ease;

  @media (max-width: 600px) {
    padding: 12px 15px;
  }
`;

const SongHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const SongName = styled.div`
display: flex;
gap: 1em;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.buttonBg};
  }
`;

const SmallButton = styled.button`
  padding: 6px 10px;
  font-size: 13px;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }

  @media (max-width: 600px) {
    margin-top: 8px;
  }
`;

const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 30px;
`;

export default function ViewPages({ toggleTheme, themeMode }) {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem('guitar-app-admin')
    if(!admin){
      navigate('/admin-login')
      return;
    }
    const fetchSongs = async () => {
      try {
        const res = await axios.get(getPagesRoute);
        setSongs(res.data.pages);
        setFilteredSongs(res.data.pages);
      } catch (err) {
        console.error("Failed to fetch songs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [navigate]);

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
    navigate(`/player/${song.googleLink}`);
  };

  const handleViewUsers = (pageId) => {
  navigate(`/admin/all-users/${pageId}`);
  };

  return (
    <Container>
      <AdminNavbar themeMode={themeMode} toggleTheme={toggleTheme}/>
      <Section><TopSection>
        <Heading><GiGuitar /> All pages</Heading>
      </TopSection>

      <SearchInput
        type="text"
        placeholder="Search Pages..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? (
        <Loading>Loading pages...</Loading>
      ) : (
        <SongList>
          {filteredSongs.length === 0 && <p>No songs found.</p>}
          {filteredSongs.map(song => (
            <SongItem key={song._id}>
              <SongHeader>
                <SongName onClick={() => handleSelect(song)}>
                   <GiGuitarHead/>{song.name}
                </SongName>
                <SmallButton onClick={() => handleViewUsers(song._id)}>
                  View User Access
                </SmallButton>
              </SongHeader>
            </SongItem>
          ))}
        </SongList>
      )}</Section>
      
    </Container>
  );
}
