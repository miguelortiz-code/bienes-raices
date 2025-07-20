import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { generateId } from '../helpers/token.js';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'properties',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => generateId(),
  }
});

const upload = multer({ storage });

export default upload;