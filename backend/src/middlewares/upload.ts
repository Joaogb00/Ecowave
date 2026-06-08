import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Aponta para a pasta 'uploads' que está na raiz do seu projeto backend
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Cria um nome único com timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });