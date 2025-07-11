import React from 'react';
import styled from 'styled-components';

const SectionTitle = styled.h4`
  margin: 16px 0 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.heading};
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding-bottom: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  background-color: ${({ theme }) => theme.sidebarBg};
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: ${({ $small }) => ($small ? '4px 10px' : '6px 14px')};
  font-size: ${({ $small }) => ($small ? '12px' : '14px')};
  margin: 2px;
  border: none;
  border-radius: ${({ $small }) => ($small ? '16px' : '6px')};
  background-color: ${({ active, theme }) =>
    active ? theme.buttonBg : theme.cardBorder};
  color: ${({ theme }) => theme.buttonText};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const Controls = ({
  selectedChord,
  setSelectedChord,
  chordData,
  voicingIndex,
  setVoicingIndex
}) => {
  const [currentRoot, currentType] = selectedChord.split(' ');

  const chordNames = Object.keys(chordData);

  const rootNotes = Array.from(new Set(
    chordNames.map((name) => name.split(' ')[0])
  ));

  const chordTypes = Array.from(new Set(
    chordNames.map((name) => name.split(' ')[1])
  ));

  const changeChord = (root, type) => {
    const fullName = `${root} ${type}`;
    if (chordData[fullName]) {
      setSelectedChord(fullName);
      setVoicingIndex(0); // Reset voicing
    }
  };

  return (
    <div>
      <SectionTitle>Chord Root</SectionTitle>
      <ButtonGroup>
        {rootNotes.map((root) => (
          <Button
            key={root}
            active={root === currentRoot}
            onClick={() => changeChord(root, currentType)}
          >
            {root}
          </Button>
        ))}
      </ButtonGroup>

      <SectionTitle>Chord Type</SectionTitle>
      <ButtonGroup>
        {chordTypes.map((type) => (
          <Button
            key={type}
            active={type === currentType}
            onClick={() => changeChord(currentRoot, type)}
          >
            {type}
          </Button>
        ))}
      </ButtonGroup>

      <SectionTitle>Voicing</SectionTitle>
      <ButtonGroup>
        {Array.from({ length: chordData[selectedChord]?.length || 0 }).map((_, i) => (
          <Button
            key={i}
            $small
            active={i === voicingIndex}
            onClick={() => setVoicingIndex(i)}
          >
            {i + 1}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default Controls;
