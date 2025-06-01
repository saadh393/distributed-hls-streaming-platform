const express = require('express');
const uploadRoutes = require('./routes/upload.route')

const app = express()
const port = process.env.PORT || 4001;

app.use(express.json())
app.use('/api', uploadRoutes)

// Test Route
app.get('/', (req, res) => res.send('Upload Service Running'));

app.listen(port, () => {
  console.log(`Uploader Service is running at http://localhost:${port}`)
})