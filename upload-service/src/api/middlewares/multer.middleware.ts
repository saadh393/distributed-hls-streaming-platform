import multer from "multer";
import path from "path";
import generateId from "../../utils/generate-id";
import { tmpdir } from "./../../config/config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadId = req?.params?.videoId;
    cb(null, path.join(tmpdir, uploadId));
  },
  filename: function (req, file, cb) {
    const suffix = "chunk_";
    // params
    const uploadId = req?.params?.videoId ?? generateId();
    const chunkIndex = req?.params?.chunkIndex ?? generateId();
    const fileExtenstion = path.extname(file.originalname);
    cb(null, suffix + uploadId + "_" + chunkIndex + fileExtenstion);
  },
});

const multerMiddleware = multer({ storage: storage });

export default multerMiddleware;
