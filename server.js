const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const fontsDirectory = path.join(__dirname, 'public', 'fonts');

app.get('/api/fonts', (req, res) => {
  fs.readdir(fontsDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read fonts directory' });
    }

    // Normalize extensions to .ttf
    const fonts = files
      .filter(file => path.extname(file).toLowerCase() === '.ttf') // Convert to lowercase
      .map(file => ({
        name: path.basename(file, path.extname(file)), // Remove extension from name
        url: `http://localhost:5000/fonts/${file}`
      }));

    res.json(fonts);
  });
});

app.use('/fonts', express.static(fontsDirectory));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});














