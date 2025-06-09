const Redis = require('ioredis');
const path = require('path');
const { Worker } = require('worker_threads');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'jobs-queue',
  port: process.env.REDIS_PORT || 6379,
});

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';
const OUTPUT_DIR = process.env.OUTPUT_DIR || '/app/processed';

function transcodeWithWorker(videoId, inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, './transcode.worker.js'), {
      workerData: { inputPath, outputPath, videoId },
    });

    worker.on('message', (msg) => {
      if (msg.status === 'success') {
        console.log(`[${videoId}] Transcoding complete`);
        resolve();
      } else {
        console.error(`[${videoId}] Transcoding failed`, msg.error);
        reject(msg.error);
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker exited with code ${code}`));
      }
    });
  });
}

function listen() {
  console.log('Transcoder service listening for jobs...');

  const loop = async () => {
    try {
      const result = await redis.brpop('video_transcode_queue', 0);
      const payload = JSON.parse(result[1]);
      const { id: videoId, path: inputRelPath } = payload;

      const inputPath = path.isAbsolute(inputRelPath)
        ? inputRelPath
        : path.join(UPLOAD_DIR, inputRelPath);
      const outputPath = path.join(OUTPUT_DIR, videoId);

      console.log(`[${videoId}] Starting worker thread...`);
      await transcodeWithWorker(videoId, inputPath, outputPath);
    } catch (err) {
      console.error('Worker loop error:', err);
    }

    setTimeout(loop, 100); // Retry interval
  };

  loop();
}

module.exports = { listen };
