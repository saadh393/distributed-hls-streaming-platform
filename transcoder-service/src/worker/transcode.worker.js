const { parentPort, workerData } = require('worker_threads');
const { transcodeToHLS } = require('../utils/transcode');
const path = require('path');

(async () => {
  try {
    const { inputPath, outputPath, videoId } = workerData;

    await transcodeToHLS(inputPath, outputPath, videoId);

    parentPort.postMessage({ status: 'success', videoId });
  } catch (error) {
    parentPort.postMessage({ status: 'error', error: error.message });
  }
})();
