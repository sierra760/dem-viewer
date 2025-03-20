const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page (serve index.html from public)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`DEM Viewer server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
  console.log(`To rebuild the application, run: npm run build`);
});