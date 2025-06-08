const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';

router.get("/:videoId", (req, res) => {
  const { videoId } = req.params;

  if(!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }

  const files = fs.readdirSync(UPLOAD_DIR);
  const match = files.find(file => file.includes(videoId));
  if (!match) {
    return res.status(404).json({ error: "Video not found" });
  }

  const videoPath =  path.join(UPLOAD_DIR, match);
  const stat = fs.statSync(videoPath);

  res.writeHead(200, {
    'Content-Length': stat.size,
    'Content-Type': 'video/mp4', // or dynamic based on extension
  });

  fs.createReadStream(videoPath).pipe(res);
});

module.exports = router;