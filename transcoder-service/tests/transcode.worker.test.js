const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');
const tmp = require('tmp');
const fse = require('fs-extra');

describe("Transcode worker", () => {
  let tempInputDir;
  let tempOutputDir;
  let inputVideoPath;
  let videoId = 'test-video-121'

  const SAMPLE_VIDEO = path.resolve(__dirname, './sample.mp4'); // Place a tiny test video here

  beforeAll(() => {
    tempInputDir = tmp.dirSync({unsafeCleanup : true});
    tempOutputDir = tmp.dirSync({ unsafeCleanup: true });

    inputVideoPath = path.join(tempInputDir.name, "input.mp4")
    fs.copyFileSync(SAMPLE_VIDEO, inputVideoPath)
  });

  afterAll(() => {
    tempInputDir.removeCallback();
    tempOutputDir.removeCallback();
  });

  it('should transcode video and create HLS segments', (done) => {
    const worker = new Worker(path.resolve(__dirname, '../src/workers/transcode.worker.js'), {
      workerData: {
        inputPath: inputVideoPath,
        outputPath: tempOutputDir.name,
        videoId,
      },
    });

    worker.on('message', (msg) => {
      try {
        expect(msg.status).toBe('success');

        const outputDir = path.join(tempOutputDir.name, videoId);
        const files = fs.readdirSync(outputDir);

        // Should create index.m3u8 and segments
        const hasM3U8 = files.some((f) => f.endsWith('.m3u8'));
        const hasTS = files.some((f) => f.endsWith('.ts'));

        expect(hasM3U8).toBe(true);
        expect(hasTS).toBe(true);

        done();
      } catch (err) {
        done(err);
      }
    });

    worker.on('error', (err) => done(err));
    worker.on('exit', (code) => {
      if (code !== 0) {
        done(new Error(`Worker exited with code ${code}`));
      }
    });
  });
})