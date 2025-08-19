import React, { useState, useRef, useEffect } from 'react';
import { scalesData } from '../data/scalesData';
import { useReactToPrint } from "react-to-print";
import Fretboard from '../Components/Chords/Fretboard';
import ScalesControls from '../Components/Chords/ScalesControls';
import UserNavbar from '../Components/UserNavbar';
import styled from 'styled-components';
import { LuListMusic } from "react-icons/lu";
import { HiPrinter } from "react-icons/hi2";
import {toast }from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import ScalesFret from '../Components/Chords/ScalesFret';

const ScalesPage = ({ themeMode, toggleTheme }) => {
  const [selectedChord, setSelectedChord] = useState("C Major");
  const [voicingIndex, setVoicingIndex] = useState(0);
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(()=>{
    const token = localStorage.getItem('user-token') || localStorage.getItem('teacher-token')
    if(!token){
      toast.info("Login first")
      navigate('/user-login');
      return;
    }
  })

  return (
    <Container>
      <UserNavbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <div style={{width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }} ref={contentRef}>
        <ContentWrapper>
          <Title><LuListMusic /> Chord Visualizer</Title>

          <ScalesControls
            selectedChord={selectedChord}
            setSelectedChord={setSelectedChord}
            scalesData={scalesData}
            voicingIndex={voicingIndex}
            setVoicingIndex={setVoicingIndex}
          />

          <ScalesFret chordNotes={scalesData[selectedChord]?.[voicingIndex] || []} />

        </ContentWrapper>
      </div>

      <PrintButton onClick={reactToPrintFn}><HiPrinter/>Print page</PrintButton>
    </Container>
  );
};

export default ScalesPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
 overflow: auto;
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
const PrintButton = styled.button`
display: flex;
gap: 3px;
  margin: 20px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.buttonBg};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

