const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const puppeteer = require('puppeteer');
const { startFFmpegStream } = require('./startStream'); // ✅ Import FFmpeg streamer

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

let browserInstance = null; // Prevent multiple Chrome instances
let ffmpegProcess = null;   // Prevent multiple FFmpeg streams

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', async ({ roomId, isHost }) => {
    socket.join(roomId);
    console.log(`${isHost ? 'Host' : 'Viewer'} joined room:`, roomId);

    if (isHost && !browserInstance) {
      io.to(roomId).emit('host-joined');

      // ✅ Launch Chrome browser
      browserInstance = await puppeteer.launch({
        headless: false, // Needed for capturing video/audio
        defaultViewport: null,
        args: [
          '--window-size=1280,720',
          '--app=https://www.google.com'
        ]
      });

      const pages = await browserInstance.pages();
      const page = pages[0];
      await page.goto('https://www.google.com');
      console.log('🚀 Chrome browser launched and opened Google.');

      // ✅ Start FFmpeg stream if not already started
      if (!ffmpegProcess) {
        ffmpegProcess = startFFmpegStream();
        console.log('🎥 FFmpeg streaming started.');
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
