import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { db } from '../Firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaPlay, FaPause, FaGuitar, FaStop, FaPrint, FaVolumeHigh } from "react-icons/fa6";
import { IoMoon, IoSunny } from "react-icons/io5";
import { MdLoop } from "react-icons/md"

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
  flex-direction: column;
  color: ${({ theme }) => theme.text};
  width: 90vw;

  .at-viewport {
    background-color: ${({ theme }) => theme.cardBg};
    height: 500px;
    overflow-y: auto;
    position: relative;
  }


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
  margin: 10px 0;

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
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    font-size: 1.8rem;
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
  border: 1px solid #444;
  background: ${({ theme }) => theme.background};  // or theme.background
  width: 100%;
  position: relative;
  z-index: 1;
`;

const Sidebar = styled.div`
  width: 200px;
  background: ${({ theme }) => theme.cardBg};
  margin-left: 1em;
  overflow-y: auto;
  border-radius: 15px;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
    border-top: 1px solid ${({ theme }) => theme.cardBorder};
  }
`;




const Controls = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  button {
    padding: 10px 20px;
    background: ${({ theme }) => theme.buttonBg};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.buttonHover};
    }
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.text};
  }

  select {
    padding: 8px;
    background: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.cardBorder};
  }

  input[type="range"] {
    accent-color: ${({ theme }) => theme.buttonBg};
  }
`;


const TimeDisplay = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.placeholder};
  text-align: center;
`;

export default function Player({ themeMode, toggleTheme }) {
  const { id } = useParams();
  const alphaTabRef = useRef(null);
  const apiRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(100);
  const [timeDisplay, setTimeDisplay] = useState('00:00 / 00:00');
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    let api; // store local reference
    console.log("Useeffect triggered");

    const fetchAndInit = async () => {
      console.log("Alphatab initialising");

      try {
        if (!window.alphaTab || !window.alphaTab.AlphaTabApi) {
          alert("AlphaTab failed to load.");
          return;
        }

        const docRef = doc(db, 'files', id);
        const docSnap = await getDoc(docRef);
        const fileId = docSnap.data()?.url;
        console.log("🎯 fileId from Firestore:", fileId);

        if (!fileId) {
          alert("No file found for this song.");
          return;
        }

        const res = await fetch(`https://guitar-pro.onrender.com/api/file?id=${fileId}`);
        console.log("📥 File fetch response:", res);
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Fetch failed:", errorText);
          alert("Error fetching file.");
          return;
        }

        const buffer = await res.arrayBuffer();
        console.log("📦 Buffer loaded. Size:", buffer.byteLength);

        // ✅ CLEAN OLD CONTENT
        if (alphaTabRef.current) {
          alphaTabRef.current.innerHTML = ''; // clear old canvas
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
          setIsLoading(false);  /// disabling spinner after score loading
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



        api.scoreError?.on((err) => {
          console.error("🔥 AlphaTab Score Error:", err);
        });

        // Setup track list DOM interaction
        const trackList = document.querySelector(".at-track-list");
        // Fill track list when score is loaded
        api.scoreLoaded.on((score) => {
          console.log("✅ scoreLoaded triggered:", score);
          if (!trackList) return;
          trackList.innerHTML = "";
          score.tracks.forEach((track) => {
            const item = createTrackItem(track);
            if (item) trackList.appendChild(item);
          });
        });

        api.load(buffer);
        console.log("📤 Buffer passed to AlphaTab API");


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


        // Highlight currently rendered track(s)
        api.renderStarted.on(() => {
          if (!trackList) return;
          const rendered = new Map();
          api.tracks.forEach((t) => rendered.set(t.index, t));

          const items = trackList.querySelectorAll(".at-track");
          items.forEach((item) => {
            if (rendered.has(item.track.index)) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });
        });

      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Something went wrong.");
      }
    };

    fetchAndInit();

    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.player?.stop();            // ⏹️ Stop playback
          apiRef.current.destroy?.();              // 💥 Destroy AlphaTab instance
          apiRef.current = null;
        } catch (e) {
          console.warn("Error while cleaning up AlphaTab:", e);
        }
      }

      if (alphaTabRef.current) {
        alphaTabRef.current.innerHTML = '';        // 🧹 Clean canvas
      }
    };

  }, [id]);


  return (

    <PlayerWrapper>
      {isLoading && (
        <FullPageSpinner>
          <div className="spinner" />
          Loading..
        </FullPageSpinner>
      )}
   <TopBar>
  <h1><FaGuitar /> Guitar Tab Player</h1>
  <button onClick={toggleTheme} aria-label="Toggle Theme">
    {themeMode === 'dark' ? <IoSunny /> : <IoMoon />}
  </button>
</TopBar>



      <ResponsiveLayout>
        {/* Scroll container */}
        <div className="at-viewport" style={{ position: 'relative', height: '500px', overflow: 'auto', flexGrow: 1 }}>
          {/* Watermark Overlay */}
          <Watermark>Designed by NDMedia</Watermark>

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


      <TimeDisplay>{timeDisplay}</TimeDisplay>
      <Controls>
        <button onClick={() => apiRef.current?.player?.play()}><FaPlay /> Play</button>
        <button onClick={() => apiRef.current?.player?.pause()}><FaPause /> Pause</button>
        <button onClick={() => apiRef.current?.player?.stop()}><FaStop /> Stop</button>
        <button onClick={() => apiRef.current?.print()}>
          <FaPrint /> Print
        </button>


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
      </Controls>

    </PlayerWrapper>
  );
}
