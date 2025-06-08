const videoRoutes = require('./routes/video.route');
const express = require('express');

const app = express();
const port = process.env.PORT || 4002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/videos', videoRoutes);

app.listen(port, () => {
  console.log(`Storage service is running on port ${port}`);
  console.log("Open http://localhost:4002/api/videos/ to test the service");
}
);

