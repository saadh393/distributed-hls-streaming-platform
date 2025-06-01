const {v4 : uuidv4} = require("uuid");
const Redis  = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || "jobs-queue", 
  port: process.env.REDIS_PORT || 6379
})

exports.uploadVideo = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file Provided" });

    const videoId = uuidv4();

    const metaData = {
      id : videoId,
      originalName : file.originalname,
      mimeType : file.mimetype, 
      size : file.size,
      path : file.path,
      status : 'uploaded', 
      uploadedAt : new Date().toISOString()
    }

    await redis.lpush("video_transcode_queue", JSON.stringify(metaData));

    res.status(200).json({success : true, videoId})
  } catch (err) {
  }
}