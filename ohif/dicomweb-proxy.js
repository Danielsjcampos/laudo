/**
 * Simple DICOMweb proxy for serving DICOM files from LaudoDigital backend
 * This allows OHIF to load files without a full DICOM server
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 5000;
const BACKEND_URL = 'http://localhost:3001';

// Enable CORS for OHIF
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// DICOMweb QIDO-RS endpoint (search for studies)
app.get('/dicomweb/studies', async (req, res) => {
  try {
    // For now, return empty array - OHIF will use direct URLs
    res.json([]);
  } catch (error) {
    console.error('Error in QIDO-RS:', error);
    res.status(500).json({ error: 'Failed to query studies' });
  }
});

// DICOMweb WADO-RS endpoint (retrieve instances)
app.get('/dicomweb/studies/:studyUID/series/:seriesUID/instances/:instanceUID', async (req, res) => {
  try {
    const { studyUID, seriesUID, instanceUID } = req.params;

    // Fetch the DICOM file from LaudoDigital backend
    const response = await axios.get(`${BACKEND_URL}/uploads/dicom/${instanceUID}.dcm`, {
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', 'application/dicom');
    res.send(response.data);
  } catch (error) {
    console.error('Error retrieving instance:', error.message);
    res.status(404).json({ error: 'Instance not found' });
  }
});

// Proxy for direct file access
app.get('/dicom/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const response = await axios.get(`${BACKEND_URL}/uploads/dicom/${filename}`, {
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', 'application/dicom');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res.status(404).json({ error: 'File not found' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DICOMweb proxy running on http://localhost:${PORT}`);
  console.log(`📡 Proxying to: ${BACKEND_URL}`);
});
