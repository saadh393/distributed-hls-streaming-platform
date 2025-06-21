import multer from "multer";
import { tmpdir } from "../../config/config";
import generateId from "../../utils/generate-id";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpdir);
  },
  filename: function (req, file, cb) {
    const suffix = "tmp_";
    const salt = generateId();
    cb(null, suffix + salt + "_" + file?.originalname);
  },
});

const multerMiddleware = multer({ storage: storage });

export default multerMiddleware;
