import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { videoQueue } from "../../config/queue";
import checkPathExists from "../../utils/check-file-exists";
import generateId from "../../utils/generate-id";
import missingChunks from "../../utils/get-missing-chunks";
import { queuedDir, tmpdir } from "./../../config/config";

function getMetaFilePath(videoId: string): string {
  return path.join(tmpdir, `/${videoId}/meta-${videoId}.json`);
}

async function init(req: Request, res: Response) {
  const { fileName, totalChunks } = req.body;
  const videoId = generateId();

  const metadata = {
    videoId,
    fileName,
    extension: path.extname(fileName),
    totalChunks,
    recievedChunks: [],
  };

  // Create Separate Directory
  await fs.promises.mkdir(path.join(tmpdir, videoId), { recursive: true });

  const META_FILE_NAME = getMetaFilePath(videoId);
  const FILE_CONTENT = JSON.stringify(metadata);
  fs.writeFile(META_FILE_NAME, FILE_CONTENT, (err) => {
    if (err) {
      throw err;
    }
    res.json({
      status: "Success",
      videoId,
    });
  });
}

async function uploadChunk(req: Request, res: Response) {
  const { videoId, chunkIndex } = req.params;

  // check if file with video id exists
  const metaFilePath = getMetaFilePath(videoId);
  if (!(await checkPathExists(metaFilePath))) {
    throw Error("Invalid Upload Id");
  }

  // Geting meta data file
  const contentBuffer = await fs.promises.readFile(metaFilePath);
  const dataObject = JSON.parse(contentBuffer.toString());

  // Updating meta chunkIndex and write
  dataObject.recievedChunks.push(parseInt(chunkIndex));
  await fs.promises.writeFile(metaFilePath, JSON.stringify(dataObject));

  // Sending back response
  res.json({
    status: "Success",
    chunkIndex,
  });
}

async function complete(req: Request, res: Response) {
  const { videoId } = req.params;

  const metaDataPath = getMetaFilePath(videoId);
  if (!(await checkPathExists(metaDataPath))) {
    throw new Error("Invalide Video id");
  }

  const contentString = await fs.promises.readFile(metaDataPath, "utf-8");
  const meta = JSON.parse(contentString);

  // If some chunks are missing send back the chunks number
  if (meta.totalChunks !== meta.recievedChunks.length) {
    const { totalChunks, recievedChunks } = meta;

    return res.status(400).json({
      status: "Failed",
      message: "There missing chunk/chunks",
      missingChunks: missingChunks(totalChunks, recievedChunks),
    });
  }

  const completePath = path.join(queuedDir, `video-${videoId}${meta.extension}`);
  const writeableStream = fs.createWriteStream(completePath);

  for (let i = 0; i < meta.totalChunks; i++) {
    const chunkPath = path.join(tmpdir, videoId, `chunk_${videoId}_${i}`);
    const readableStream = fs.createReadStream(chunkPath);
    await new Promise((resolve, rejects) => {
      readableStream.pipe(writeableStream, { end: false });
      // @ts-ignore
      readableStream.once("end", resolve);
      readableStream.once("error", rejects);
    });

    await fs.promises.rm(chunkPath);
  }

  writeableStream.end();

  // Virus Scan and Move to Storage Service
  await videoQueue.add("video-process", {
    videoId,
    meta,
    completePath,
  });

  res.json({ uploaded: true, path: completePath });
}

const fileController = {
  init,
  uploadChunk,
  complete,
};
export default fileController;
