import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import checkPathExists from "../../utils/check-file-exists";
import generateId from "../../utils/generate-id";
import { tmpdir } from "./../../config/config";

function getMetaFilePath(videoId: string): string {
  return path.join(tmpdir, `/${videoId}/meta-${videoId}.json`);
}

async function init(req: Request, res: Response) {
  const { fileName, totalChunks } = req.body;
  const videoId = generateId();

  const metadata = {
    videoId,
    fileName,
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
  dataObject.recievedChunks.push(chunkIndex);
  await fs.promises.writeFile(metaFilePath, JSON.stringify(dataObject));

  // Sending back response
  res.json({
    status: "Success",
    chunkIndex,
  });
}

function complete(req: Request, res: Response) {}

const fileController = {
  init,
  uploadChunk,
  complete,
};
export default fileController;
