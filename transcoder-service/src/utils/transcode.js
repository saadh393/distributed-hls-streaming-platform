const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs-extra');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const resolutions = [
  { name: '1080p', size: '1920x1080' },
  { name: '720p', size: '1280x720' },
  { name: '480p', size: '854x480' },
];

async function transcodeToHLS(inputPath, outputDir, videoId) {
  await fs.ensureDir(outputDir);

  const tasks = resolutions.map(({ name, size }) => {
    const resOutDir = path.join(outputDir, name);
    return new Promise((resolve, reject) => {
      fs.ensureDirSync(resOutDir);

      ffmpeg(inputPath)
        .addOption([
          '-profile:v baseline', // HLS compatibility
          '-level 3.0',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls',
        ])
        .size(size)
        .output(path.join(resOutDir, 'index.m3u8'))
        .on('end', () => {
          console.log(`[${videoId}] Transcoded ${name}`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`[${videoId}] FFmpeg error (${name}):`, err);
          reject(err);
        })
        .run();
    });
  });

  return Promise.all(tasks);
}

module.exports = { transcodeToHLS, resolutions };
