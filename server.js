const express = require('express');
const path = require('path');
const server = express();

// Serve static files from the project directory
server.use(express.static(__dirname));

// Route to serve the index.html file
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
