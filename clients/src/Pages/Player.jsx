import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlay, FaPause, FaGuitar, FaStop, FaPrint, FaVolumeHigh, FaWhatsapp } from "react-icons/fa6";
import { IoHome, IoMoon, IoSunny } from "react-icons/io5";
import { MdLoop } from "react-icons/md"
import { getDriveFileRoute, getPageDetailsRoute } from '../Utils/APIRoutes';
import axios from 'axios';
import { toast } from 'react-toastify';

/// === STYLED COMPONENTS === ///

/// SPINNER ANIMATION

const FullPageSpinner = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .spinner {
    width: 60px;
    height: 60px;
    border: 5px solid ${({ theme }) => theme.heading};
    border-top: 5px solid ${({ theme }) => theme.background};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;


const PlayerWrapper = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  background-color: ${({ theme }) => theme.playerBg};
  color: ${({ theme }) => theme.text};
  width: 100vw;
  height: 100vh;

  .at-track.active {
    background: ${({ theme }) => theme.buttonHover};
    color: ${({ theme }) => theme.background};
  }

  .at-track {
    display: flex;
    align-items: center;
    padding: 8px;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .at-track:hover {
    background: ${({ theme }) => theme.buttonHover};
  }

  .at-track-icon {
    margin-right: 10px;
    color: ${({ theme }) => theme.heading};
  }
`;

const ResponsiveLayout = styled.div`
  display: flex;
  flex-direction: row;
  padding: 2em;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const TopBar = styled.div`
     display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 15px 35px;

  h1 {
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    color: ${({ theme }) => theme.heading};
  }

  button {
    background: none;
    color: ${({ theme }) => theme.buttonBg};
    border: none;
    cursor: pointer;
    font-size: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    align-items: flex-start;

    h1 {
      font-size: 1.4rem;
    }

    button {
      align-self: flex-end;
    }
  }
`;

const TopButtonSection = styled.div`
  display: flex;
`


const Watermark = styled.div`
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 3rem;
  color: ${({ theme }) => theme.watermark};
  pointer-events: none;
  z-index: 10;
  user-select: none;
  white-space: nowrap;
`;
const AlphaTabContainer = styled.div`
  background: ${({ theme }) => theme.playerBg};
  width: 100%;
  position: relative;
  z-index: 1;
`;

const Sidebar = styled.div`
  width: 200px;
  background: ${({ theme }) => theme.sidebarBg};
  margin-left: 1em;
  overflow-y: auto;
  border-radius: 15px;

  @media (max-width: 768px) {
   width: 100%;
   padding: 10px 10px;
   border-right: none;
   margin: auto;
   border-radius: 15px;
  }
`;

const Controls = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
 
  z-index: 99;

  @media (max-width: 768px) {
    background: ${({ theme }) => theme.playerBg};
    position: sticky;
    bottom: 0;
    padding: 8px 20px;
    gap: 8px;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  }

  button {
    padding: 13px 13px;
    border-radius: 25px;
    background: ${({ theme }) => theme.buttonBg};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    cursor: pointer;
    font-size: 1.2rem;

    &:hover {
      background: ${({ theme }) => theme.buttonHover};
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.text};

    /* @media (max-width: 768px) {
      width: 100%;
    } */
  }

  select,
  input[type="range"],
  input[type="checkbox"] {
    flex-shrink: 1;
  }

  input[type="range"] {
    accent-color: ${({ theme }) => theme.buttonBg};
  }
`;


const ButtonsSection = styled.div`
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 8px;

    button {
      flex: 1;
    }
  }
`;


const TimeDisplay = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.heading};
  text-align: center;
`;
const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25D366;
  color: white;
  font-weight: bold;
  padding: 12px 18px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 1000;
  transition: background 0.2s;

  &:hover {
    background-color: #1ebe5d;
  }

  svg {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    padding: 10px 10px;
    font-size: 0;
    &:hover{
      font-size: 14px;
    }
  }
`;

const InstructionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .instruction-box {
    background: ${({ theme }) => theme.cardBg};
    color: ${({ theme }) => theme.text};
    max-height: 500px;
    overflow: auto;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
  }

  ul {
    padding-left: 1.2rem;
    margin-top: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;



export default function Player({ themeMode, toggleTheme }) {
  const { id } = useParams();
  const alphaTabRef = useRef(null);
  const apiRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(100);
  const [timeDisplay, setTimeDisplay] = useState('00:00 / 00:00');
  const [tracks, setTracks] = useState([]);
  const [page, setPage] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  /// === WHATSAPP MESSAGE SETUP === ///

  const adminNumber = '918388951121'; // Replace with your admin number

  const pageName = page.name || 'Unknown page'; // `id` comes from URL params
  const username = user?.username || 'Unknown User';
  const userId = user?.userId;

  const whatsappMessage = `Hi, I'm ${username} and I'm having an issue with the chapter: ${pageName}
UserId :${userId} `;
  const encodedMessage = encodeURIComponent(whatsappMessage);

  const whatsAppLink = `https://wa.me/${adminNumber}?text=${encodedMessage}`;

  useEffect(() => {
    const token = localStorage.getItem('admin-token') || localStorage.getItem('user-token') || localStorage.getItem('teacher-token');

    if (!token) {
      toast.info('Login first')
      navigate('/user-login');
      return;
    }
    const storedUser = localStorage.getItem('guitar-app-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    let api;
    const fetchAndInit = async () => {

      try {
        if (!window.alphaTab || !window.alphaTab.AlphaTabApi) {
          alert("AlphaTab failed to load.");
          return;
        }
        if (!id) {
          alert("No file found for this song.");
          return;
        }
        const res = await axios.post(
          getDriveFileRoute,
          { id },
          {
            responseType: "arraybuffer",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const buffer = res.data;
        if (alphaTabRef.current) {
          alphaTabRef.current.innerHTML = '';
        }

        api = new window.alphaTab.AlphaTabApi(alphaTabRef.current, {
          core: {
            workerUrl: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.5.0/dist/alphaTab.worker.mjs"
          },
          player: {
            enablePlayer: true,
            scrollElement: document.querySelector(".at-viewport"),
            enableCursor: true,
            enableMetronome: true,
            enableLooping: true,
            soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.5.0/dist/soundfont/sonivox.sf2"
          },
          display: {
            layoutMode: 'page',
            stretchToMargin: true,
            renderSingleTrack: false,
            autoScroll: true,
            followPlayback: true,
            showCursor: true,
            scale: 1.0
          },
          fonts: [
            {
              name: "alphaTab",
              url: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.5.0/dist/font/Bravura.woff2"
            }
          ]
        });

        apiRef.current = api;

        api.scoreError?.on(err => {
          console.error("AlphaTab error:", err);
          alert("Could not load score: " + err.message);
        });

        api.scoreLoaded?.on(() => {
          const scoreTracks = api.score.tracks;
          setTracks(scoreTracks);
          setIsLoading(false);
        });

        api.playerReady?.on(() => {
          if (api.player) {
            api.player.metronomeVolume = 0;
            api.updateSettings();
          }
        });

        api.playerPositionChanged?.on(e => {
          const format = ms => {
            const min = String(Math.floor(ms / 60000)).padStart(2, '0');
            const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
            return `${min}:${sec}`;
          };
          setTimeDisplay(`${format(e.currentTime)} / ${format(e.endTime)}`);
        });

        const trackList = document.querySelector(".at-track-list");
        api.scoreLoaded.on(score => {
          if (!trackList) return;
          trackList.innerHTML = "";
          score.tracks.forEach(track => {
            const item = createTrackItem(track);
            if (item) trackList.appendChild(item);
          });
        });

        api.load(buffer);

        function createTrackItem(track) {
          const template = document.querySelector("#at-track-template");
          if (!template) return null;
          const trackItem = template.content.cloneNode(true).firstElementChild;
          trackItem.querySelector(".at-track-name").innerText = track.name;
          trackItem.track = track;
          trackItem.onclick = (e) => {
            e.stopPropagation();
            api.renderTracks([track]);
          };
          return trackItem;
        }

        api.renderStarted.on(() => {
          if (!trackList) return;
          const rendered = new Map();
          api.tracks.forEach(t => rendered.set(t.index, t));

          const items = trackList.querySelectorAll(".at-track");
          items.forEach(item => {
            if (rendered.has(item.track.index)) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });
        });

      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Invalid google drive link by admin");
      }
    };

    fetchAndInit();

    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.player?.stop();
          apiRef.current.destroy?.();
          apiRef.current = null;
        } catch (e) {
          console.warn("Error while cleaning up AlphaTab:", e);
        }
      }

      if (alphaTabRef.current) {
        alphaTabRef.current.innerHTML = '';
      }
    };

  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('admin-token') || localStorage.getItem('user-token') || localStorage.getItem('teacher-token');
    const getPageDetails = async () => {
      try {
        const res = await axios.get(`${getPageDetailsRoute}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPage(res.data.page)
      } catch (err) {
        console.log("Error in fetching page details");
      }
    }
    getPageDetails();
  }, [])


  /// === PLAY/PAUSE HANDLER === ///
  const handleToggle = () => {
    const player = apiRef.current?.player;
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    const player = apiRef.current?.player;
    if (!player) return;
    player.stop();

  }

  return (

    <PlayerWrapper>
      {isLoading && (
        <FullPageSpinner>
          <div className="spinner" />
          Loading..
        </FullPageSpinner>
      )}
      <TopBar>
        <h1><FaGuitar /> Live Lesson</h1>
        <TopButtonSection> <button onClick={toggleTheme} aria-label="Toggle Theme">
          {themeMode === 'dark' ? <IoSunny /> : <IoMoon />}
        </button>
          <button onClick={() => { navigate('/') }}>
            <IoHome />
          </button></TopButtonSection>

      </TopBar>



      <ResponsiveLayout>
        {/* Scroll container */}
        <div className="at-viewport" style={{ position: 'relative', height: '500px', overflow: 'auto', flexGrow: 1 }}>
          {/* Watermark Overlay */}
          <Watermark> Guitarature</Watermark>

          {/* AlphaTab Canvas Container */}
          <AlphaTabContainer ref={alphaTabRef} />

        </div>

        {/* Sidebar (moves below on mobile) */}
        <Sidebar>
          <div className="at-sidebar-content">
            <div className="at-track-list"></div>
          </div>
        </Sidebar>
      </ResponsiveLayout>

      <div style={{ textAlign: 'center' }}>
        <p>Need help? <button
          style={{
            padding: '10px 20px',
            background: 'transparent',
            textDecoration: 'underline',
            backgroundColor: '#fcb036',
            color: '#121212',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
          onClick={() => setShowInstructions(true)}
        >
          View Instructions
        </button></p>

      </div>

      <Controls>
        <TimeDisplay>{timeDisplay}</TimeDisplay>
        <ButtonsSection>
          <button onClick={handleToggle}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleStop}><FaStop /></button>
          <button onClick={() => apiRef.current?.print()}>
            <FaPrint />
          </button>
        </ButtonsSection>
        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              if (apiRef.current?.player) {
                apiRef.current.player.isLooping = e.target.checked;
              }
            }}
          />
          <MdLoop />
          Loop
        </label>

        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              const enabled = e.target.checked;
              if (apiRef.current?.player) {
                apiRef.current.player.enableMetronome = enabled;
                apiRef.current.player.metronomeVolume = enabled ? 1 : 0;
                apiRef.current.updateSettings();
              }
            }}
          />
          Metronome
        </label>

        {/* 🎚️ Master Volume */}
        <label>
          <FaVolumeHigh />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="1"
            onInput={(e) => {
              const volume = parseFloat(e.target.value);
              if (apiRef.current?.player) {
                apiRef.current.player.masterVolume = volume;
              }
            }}
          />
        </label>
        <label>
          Tempo: {playbackSpeed}%
          <input
            type="range"
            min="50"
            max="200"
            value={playbackSpeed}
            onInput={(e) => {
              const speed = parseInt(e.target.value);
              setPlaybackSpeed(speed); // update UI
              if (apiRef.current?.player) {
                apiRef.current.player.playbackSpeed = speed / 100;
              }
            }}
          />
        </label>

      </Controls>


      <WhatsAppButton
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
        Chat with Admin
      </WhatsAppButton>
      {showInstructions && (
        <InstructionOverlay>
          <div className="instruction-box">
            <button className="close-btn" onClick={() => setShowInstructions(false)}>×</button>
            <h2>How to Read and Practice Guitar Tabs</h2>
            <ol>
              <li>
                <strong>Understand the Tab Layout:</strong><br />
                Tabs have six horizontal lines, each representing a guitar string.
                <ul>
                  <li>Bottom line = 6th string (low E)</li>
                  <li>Top line = 1st string (high E)</li>
                  <li>Numbers = frets to press (e.g., 3 on 2nd line = 3rd fret on B string)</li>
                </ul>
              </li>

              <li>
                <strong>Read Left to Right:</strong><br />
                Play notes in order. Notes stacked vertically are played together like chords.
              </li>

              <li>
                <strong>Keep Fingers Close to Frets:</strong><br />
                Press just behind the fret wire for a clean tone and less buzzing.
              </li>

              <li>
                <strong>Use Correct Fingering:</strong><br />
                Use all four fingers (1-index, 2-middle, 3-ring, 4-pinky) efficiently across the fretboard.
              </li>

              <li>
                <strong>Follow the Rhythm (if shown):</strong><br />
                Tabs may not always show timing — listen to the original song to get the feel.
              </li>

              <li>
                <strong>Practice Slowly First:</strong><br />
                Go note by note. Speed will improve with time and repetition.
              </li>

              <li>
                <strong>Watch for Symbols:</strong><br />
                <ul>
                  <li><code>h</code> = hammer-on (e.g., 5h7)</li>
                  <li><code>p</code> = pull-off (e.g., 7p5)</li>
                  <li><code>/</code> = slide up (e.g., 5/7)</li>
                  <li><code>\</code> = slide down (e.g., 7\5)</li>
                  <li><code>b</code> = bend</li>
                  <li><code>~</code> = vibrato</li>
                </ul>
              </li>

              <li>
                <strong>Use Alternate Picking:</strong><br />
                Down-up strokes improve speed and accuracy — practice them on simple riffs.
              </li>

              <li>
                <strong>Use a Metronome:</strong><br />
                Start slow, increase tempo gradually — it helps develop solid timing.
              </li>
            </ol>

          </div>
        </InstructionOverlay>
      )}

    </PlayerWrapper>

  );
}
