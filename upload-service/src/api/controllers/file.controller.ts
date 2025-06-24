import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import generateId from "../../utils/generate-id";
import { tmpdir } from "./../../config/config";

function init(req: Request, res: Response) {
  const { fileName, totalChunks } = req.body;
  const videoId = generateId();

  const metadata = {
    videoId,
    fileName,
    totalChunks,
    recievedChunks: [],
  };

  const META_FILE_NAME = path.join(tmpdir, `meta-${videoId}.json`);
  const FILE_CONTENT = JSON.stringify(metadata);
  fs.writeFile(META_FILE_NAME, FILE_CONTENT, (err) => {
    if (err) {
      throw err;
    }
    res.json({
      status: "Success",
    });
  });
}

function uploadChunk(req: Request, res: Response) {}

function complete(req: Request, res: Response) {}

const fileController = {
  init,
  uploadChunk,
  complete,
};
export default fileController;
