import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Hls from 'hls.js';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  transports: ['websocket'],
});

function App() {
  const [role, setRole] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!role) return;

      console.log('Connected to server:', socket.id);
      console.log('joining as', role);
      socket.emit('join-room', { roomId: 'demo-room', isHost: role === 'host' });

    socket.on('host-joined', () => {
      console.log('Host has joined the room');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [role]);

  useEffect(() => {
    if (role === 'viewer' && videoRef.current) {
      const video = videoRef.current;
      const hls = new Hls();
      const videoSrc = 'http://localhost:8000/live/stream/index.m3u8';

      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
  }, [role]);

  if (!role) {
    return (
      <div>
        <h2>Join as:</h2>
        <button onClick={() => setRole('host')} style={{ marginRight: '1rem' }}>Host</button>
        <button onClick={() => setRole('viewer')}>Viewer</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Shared Virtual Browser Streaming</h1>
      {role === 'viewer' && (
        <video
          ref={videoRef}
          controls
          autoPlay
          muted={false}
          style={{ width: '100%', maxWidth: '800px', borderRadius: '8px' }}
        />
      )}
      {role === 'host' && <p>You are the host. Virtual browser is running.</p>}
    </div>
  );
}

export default App;