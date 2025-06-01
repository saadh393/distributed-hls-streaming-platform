const multer = require('multer')

const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
const UPLOAD_DIR = "/app/uploads"

const storage = multer.diskStorage({
  destination : (req, file, cb) => {
    return cb(null, process.env.UPLOAD_DIR || UPLOAD_DIR)
  },
  filename : (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName)
  }
});

const fileFilter = (req, file, cb) => {
  if(!allowedTypes.includes(file.mimetype)){
    return cb(new Error("File Type Not Allowed"), false)
  }else{
    cb(null, true)
  }
}

const upload = multer({
  storage, 
  fileFilter,
  limits : {
    fileSize : 500 * 1024 * 1024
  }
})

module.exports = upload;