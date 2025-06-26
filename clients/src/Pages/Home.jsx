import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../Firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

// const Wrapper = styled.div`
//   min-height: 100vh;
//   background: #111;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 40px 20px;
// `;

const Container = styled.div`
  width: 80vw;
  background: #1e1e1e;
  padding: 30px;
  border-radius: 16px;
  color: #f4f4f4;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
`;

const TopSection = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 2em;
`

const Heading = styled.h2`
  text-align: center;
  color: #00d1b2;
  margin-bottom: 25px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.02);
  }

  svg {
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
  width: 97%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin-bottom: 20px;
  background: #2a2a2a;
  color: #fff;
  font-size: 16px;
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SongItem = styled.li`
  background: #2a2a2a;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;

  &:hover {
    background: #00d1b2;
    color: #000;
    transform: scale(1.02);
  }
`;

const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 30px;
`;

export default function Home() {
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
    console.log(song.url);
    
    navigate(`/player/${song.id}`); // You can use this ID in player page to fetch song
  };

  return (
  
      <Container>
        <TopSection>
 <Heading>🎶 Available Songs</Heading>
        <Button onClick={()=>{navigate('/admin')}}>
      <FaUserShield />
      Admin
    </Button>
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
