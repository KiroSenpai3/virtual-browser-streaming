import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function LiveStreamViewer() {
  const videoRef = useRef();

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('http://localhost:8000/live/browser/index.m3u8');
      hls.attachMedia(videoRef.current);
    }
  }, []);

  return (
    <div>
      <h2>Live Browser Stream</h2>
      <video ref={videoRef} controls autoPlay style={{ width: '100%' }} />
    </div>
  );
}

export default LiveStreamViewer;
