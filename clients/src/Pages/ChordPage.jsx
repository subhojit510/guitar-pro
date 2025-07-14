import React, { useState, useEffect } from 'react';
import { chordData } from '../data/chordData';
import Fretboard from '../Components/Chords/Fretboard';
import Controls from '../Components/Chords/Controls';
import UserNavbar from '../Components/UserNavbar';
import styled from 'styled-components';
import { LuListMusic } from "react-icons/lu";

const ChordPage = ({ themeMode, toggleTheme }) => {
  const [selectedChord, setSelectedChord] = useState("C Major");
  const [voicingIndex, setVoicingIndex] = useState(0);
  

  useEffect(() => {
    setVoicingIndex(0);
  }, [selectedChord]);

  return (
    <Container>
      <UserNavbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <ContentWrapper>
        <Title><LuListMusic /> Chord Visualizer</Title>

        <Controls
          selectedChord={selectedChord}
          setSelectedChord={setSelectedChord}
          chordData={chordData}
          voicingIndex={voicingIndex}
          setVoicingIndex={setVoicingIndex}
        />

        <Fretboard chordNotes={chordData[selectedChord]?.[voicingIndex] || []} />
      </ContentWrapper>
    </Container>
  );
};

export default ChordPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  width: 100%;
  max-width: 900px;
`;

const Title = styled.h2`
display: flex;
align-items: center;
gap: 2px;
  font-size: 26px;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 20px;
  font-weight: 600;
`;
