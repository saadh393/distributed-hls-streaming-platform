import { Request, Response } from "express";
import { createReadStream, createWriteStream } from "fs";
import fs from "fs/promises";
import path from "path";
import { videoQueue } from "../../config/queue";
import checkPathExists from "../../utils/check-file-exists";
import missingChunks from "../../utils/get-missing-chunks";
import { queuedDir, tmpdir } from "./../../config/config";

function getMetaFilePath(videoId: string): string {
  return path.join(tmpdir, `/${videoId}/meta-${videoId}.json`);
}

async function init(req: Request, res: Response) {
  const { fileName, totalChunks, videoId } = req.body;

  if (!fileName || !videoId || !totalChunks) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const dir = path.join(tmpdir, videoId);
  await fs.mkdir(dir, { recursive: true });

  const META_FILE_NAME = getMetaFilePath(videoId);
  // include all fields you'll need later to avoid undefined (e.g., recievedChunks, extension)
  await fs.writeFile(
    META_FILE_NAME,
    JSON.stringify({ fileName, totalChunks, recievedChunks: [], extension: path.extname(fileName) })
  );

  return res.status(201).json({ status: "Success", videoId });
}

async function uploadChunk(req: Request, res: Response) {
  console.log("Chunk Recieved");
  const { videoId, chunkIndex } = req.params;

  // check if file with video id exists
  const metaFilePath = getMetaFilePath(videoId);
  if (!(await checkPathExists(metaFilePath))) {
    throw Error("Invalid Upload Id");
  }

  // Geting meta data file
  const contentBuffer = await fs.readFile(metaFilePath);
  const dataObject = JSON.parse(contentBuffer.toString());

  // Updating meta chunkIndex and write
  dataObject.recievedChunks.push(parseInt(chunkIndex));
  await fs.writeFile(metaFilePath, JSON.stringify(dataObject));

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

  const contentString = await fs.readFile(metaDataPath, "utf-8");
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
  const writeableStream = createWriteStream(completePath);

  for (let i = 0; i < meta.totalChunks; i++) {
    const chunkPath = path.join(tmpdir, videoId, `chunk_${videoId}_${i}`);
    const readableStream = createReadStream(chunkPath);
    await new Promise((resolve, rejects) => {
      readableStream.pipe(writeableStream, { end: false });
      // @ts-ignore
      readableStream.once("end", resolve);
      readableStream.once("error", rejects);
    });

    await fs.rm(chunkPath);
  }

  writeableStream.end();

  writeableStream.on("finish", () => {
    console.log("All chunks written successfully");
    fs.rmdir(path.join(tmpdir, videoId));
  });

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
