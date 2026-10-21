require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const { Dropbox } = require('dropbox');
const fetch = require('isomorphic-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Dropbox SDK
const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch: fetch
});

// Middleware
app.use(express.static('public'));
app.use(fileUpload());

// API: List files from Dropbox
app.get('/files', async (req, res) => {
  try {
    const response = await dbx.filesListFolder({ path: '' });
    const files = response.result.entries.map(file => ({
      name: file.name,
      path: file.path_lower,
      size: file.size
    }));
    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to retrieve files from Dropbox.' });
  }
});

// API: Upload file to Dropbox
app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFile = req.files.file;
  const dropboxPath = '/' + uploadedFile.name;

  try {
    const response = await dbx.filesUpload({
      path: dropboxPath,
      contents: uploadedFile.data,
      mode: 'overwrite'
    });
    res.json({ message: 'File uploaded successfully!', file: response.result });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file to Dropbox.' });
  }
});

// API: Download file from Dropbox
app.get('/download', async (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).send('File path is required.');
  }

  try {
    const response = await dbx.filesDownload({ path: filePath });
    res.setHeader('Content-Disposition', `attachment; filename="${response.result.name}"`);
    res.send(response.result.fileBinary);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file from Dropbox.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
