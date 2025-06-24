import multer from "multer";
import { tmpdir } from "../../config/config";
import generateId from "../../utils/generate-id";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpdir);
  },
  filename: function (req, file, cb) {
    const suffix = "chunk_";
    // params
    const uploadId = req?.params?.uploadId ?? generateId();
    const chunkIndex = req?.params?.chunkIndex ?? generateId();
    const fileExtenstion = file.originalname.split(".")[1];
    cb(null, suffix + uploadId + "_" + chunkIndex + fileExtenstion);
  },
});

const multerMiddleware = multer({ storage: storage });

export default multerMiddleware;
