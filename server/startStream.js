// startStream.js
const { spawn } = require('child_process');

function startFFmpegStream() {
  const ffmpeg = spawn('ffmpeg', [
    '-f', 'gdigrab',
    '-framerate', '30',
    '-i', 'title=Google', // Replace this with the actual window title if needed
    '-f', 'dshow',
    '-i', 'audio=Microphone (USB PnP Audio Device)', // Change to match your mic name
    '-vcodec', 'libx264',
    '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p',
    '-acodec', 'aac',
    '-f', 'flv',
    'rtmp://localhost/live/stream'
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
