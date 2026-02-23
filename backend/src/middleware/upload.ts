
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
const dicomDir = path.join(uploadDir, 'dicom');
const medicalRequestsDir = path.join(uploadDir, 'medical-requests');
const previewDir = path.join(uploadDir, 'previews');

// Create directories if they don't exist
[uploadDir, dicomDir, medicalRequestsDir, previewDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'medicalRequest') {
      cb(null, medicalRequestsDir);
    } else {
      cb(null, dicomDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});
