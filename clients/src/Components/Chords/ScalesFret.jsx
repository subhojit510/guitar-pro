import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  
`;

const FretboardContainer = styled.div`
  display: flex;
`;

const StringLabels = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 5px;
  height: 230px; // 6 strings × 56px
`;

const StringLabel = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.heading};
  font-weight: bold;
`;

const FretLabels = styled.div`
  display: flex;
  margin-left: 24px;
  height: 24px;
  width: 73.5em;

  & > div:first-child {
    width: 28px; /* Match half width of first fret */
  }
`;


const FretLabel = styled.div`
  width: 56px;
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.heading};
`;

const FretboardGrid = styled.div`
  display: grid;
  grid-template-columns: 33px repeat(21, 55px); /* First fret = half-width */
  grid-template-rows: repeat(6, 37px);
  background-color: #1f1f1f;
  position: relative;
  border: 4px solid #000;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);

  /* Watermark */
  &::before {
    content: 'Guitarature'; /* Replace with your brand or watermark text */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 48px;
    color: rgba(255, 255, 255, 0.05); /* subtle watermark */
    white-space: nowrap;
    pointer-events: none; /* prevent interaction */
    z-index: 0;
  }
`;



const Fret = styled.div`
  position: relative;
  border-left: 3px solid #c4b998; // fretwire color
  border-bottom: 1px solid transparent;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    height: var(--string-thickness);
    width: 100%;
    background-color: #d2c3a3; // string color
    transform: translateY(-50%);
    z-index: 1;
    border-radius: 2px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  }
`;


const FretMarker = styled.div`
  position: absolute;
  top: 7rem;
  left: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  transform: translate(-50%, -50%);
  z-index: 0;
`;

const DoubleFretMarker = styled.div`
  position: absolute;
  left: 50%;
  top: 2rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  transform: translateX(-50%);
  box-shadow: 0 150px 0 white; // Second dot
  z-index: 0;
`;

const FingerNumber = styled.div`
  width: 28px;
  height: 28px;
  background-color: ${({ theme }) => theme.heading};
  border-radius: 50%;
  color: ${({ theme }) => theme.fretText};
  font-size: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  margin-top: 5px;
  position: relative;
  z-index: 2; /* Ensure it's above the string line */
`;

const strings = [1, 2, 3, 4, 5, 6]; // High E to Low E
const stringNames = ['E', 'B', 'G', 'D', 'A', 'E'];
const frets = Array.from({ length: 22 }, (_, i) => i);

const ScalesFret = ({ chordNotes }) => {
  if (!Array.isArray(chordNotes)) return null;

  const findNote = (stringNo, fretNo) =>
    chordNotes.find((note) => note.string === stringNo && note.fret === fretNo);

  return (
    <Wrapper>
      {/* Top fret numbers */}
      <FretLabels>
        {frets.map((fretNo) => (
          <FretLabel key={fretNo}>{fretNo}</FretLabel>
        ))}
      </FretLabels>

      {/* Left string labels + fretboard */}
      <FretboardContainer>
        <StringLabels>
          {stringNames.map((label, i) => (
            <StringLabel key={i}>{label}</StringLabel>
          ))}
        </StringLabels>

        <FretboardGrid>
          {strings.map((stringNo, stringIndex) =>
            frets.map((fretNo) => {
              const note = findNote(stringNo, fretNo);
              const thickness = 1 + stringIndex * 1.2;

              const isFirstString = stringIndex === 0;
              const showMarker = [3, 5, 7, 9, 15].includes(fretNo) && isFirstString;
              const showDoubleMarker = fretNo === 12 && isFirstString;

              return (
                <Fret
                  key={`s${stringNo}-f${fretNo}`}
                  style={{ '--string-thickness': `${thickness}px` }}
                >
                  {note && note.finger && <FingerNumber>{note.finger}</FingerNumber>}
                  {showMarker && <FretMarker />}
                  {showDoubleMarker && <DoubleFretMarker />}
                </Fret>
              );
            })
          )}
        </FretboardGrid>

      </FretboardContainer>
    </Wrapper>
  );
};

export default ScalesFret;
