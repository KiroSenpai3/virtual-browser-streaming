// startStream.js
const { spawn } = require('child_process');

function startFFmpegStream() {
  const ffmpeg = spawn('C:/ffmpeg/bin/ffmpeg.exe', [
    '-f', 'gdigrab',
    '-framerate', '30',
    '-i', 'title=Google', // Replace this with the actual window title if needed
    '-f', 'dshow',
    '-i', 'audio=Microphone (USB PnP Audio Device)', // Change to match your mic name
    '-vf', 'scale=1280:720',
    '-vcodec', 'libx264',
    '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p',
    '-acodec', 'aac',
    '-f', 'flv',
    'rtmp://localhost:1935/live/stream'
  ]);

  ffmpeg.stdout.on('data', (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  return ffmpeg;
}

module.exports = { startFFmpegStream };
