import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `recompensa-${uniqueSuffix}${ext}`);
  },
});

export const uploadRecompensa = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});