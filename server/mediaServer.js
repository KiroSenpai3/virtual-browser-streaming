const  NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
  },
  trans: {
    ffmpeg: 'C:/ffmpeg/bin/ffmpeg.exe', // ✅ Make sure this is valid
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        hlsKeep: true,
      },
    ],
  },
};

console.log('✅ Starting media server with config:', JSON.stringify(config, null, 2));

const nms = new NodeMediaServer(config);

nms.on('preConnect', (id, args) => {
  console.log(`[NodeEvent] preConnect ${id}`);
});
nms.on('postPublish', (id, streamPath, args) => {
  console.log(`[NodeEvent] postPublish: ${streamPath}`);
});
nms.on('donePublish', (id, streamPath, args) => {
  console.log(`[NodeEvent] donePublish: ${streamPath}`);
});

nms.run();
