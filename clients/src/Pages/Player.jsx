import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { db } from '../Firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaPlay, FaPause, FaStop, FaLoop, FaPrint } from "react-icons/fa6";
import { MdLoop } from "react-icons/md"

const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  width: 90vw;

  .at-viewport {
    background-color: #2a2a2a;
  height: 500px;
  overflow-y: auto;
  position: relative;
}

  .at-sidebar {
  width: 200px;
  background: #2a2a2a;
  border-right: 1px solid #444;
  overflow-y: auto;
}

.at-sidebar-content {
  padding: 10px;
}

.at-track.active {
  background: #fff;
  color: black;
}


.at-track {
  display: flex;
  align-items: center;
  padding: 8px;
  color: #fff;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.at-track:hover {
  background: #444;
}

.at-track-icon {
  margin-right: 10px;
  color: #00d1b2;
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
    background: #00d1b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background: #00b89c;
    }
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ccc;
  }

  select {
    padding: 8px;
    background: #333;
    color: white;
    border-radius: 4px;
    border: 1px solid #666;
  }
`;

const TimeDisplay = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: #aaa;
  text-align: center;
`;

export default function Player() {
  const { id } = useParams();
  const alphaTabRef = useRef(null);
  const apiRef = useRef(null);
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
            workerUrl: `${window.location.origin}/alphatab/alphaTab.worker.mjs`
          },
          player: {
            enablePlayer: true,
            scrollElement: document.querySelector(".at-viewport"),
            enableCursor: true,
            enableMetronome: true,
            enableLooping: true,
            soundFont: `${window.location.origin}/alphatab/soundfont/sonivox.sf2`,
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
              url: `${window.location.origin}/alphatab/font/Bravura.woff2`
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
      <h2>🎸 Guitar Tab Player</h2>
     <div style={{ display: 'flex' }}>
  {/* Sidebar */}
  <div className="at-sidebar">
    <div className="at-sidebar-content">
      <div className="at-track-list"></div>
    </div>
  </div>

  {/* Scroll container */}
  <div className="at-viewport" style={{ height: '500px', overflow: 'auto', flexGrow: 1 }}>
    <div
      ref={alphaTabRef}
      style={{
        border: '1px solid #444',
        background: '#1e1e1e',
        width: '100%',
        // ✅ Removed height and overflow here
      }}
    />
  </div>
</div>

      <TimeDisplay>{timeDisplay}</TimeDisplay>
     <Controls>
  <button onClick={() => apiRef.current?.player?.play()}><FaPlay /> Play</button>
  <button onClick={() => apiRef.current?.player?.pause()}><FaPause /> Pause</button>
  <button onClick={() => apiRef.current?.player?.stop()}><FaStop /> Stop</button>
  <button onClick={() => apiRef.current?.print()}>
<FaPrint/> Print
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
    Volume:
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
