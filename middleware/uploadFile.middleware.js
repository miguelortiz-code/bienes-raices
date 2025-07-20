import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {generateId} from '../helpers/token.js';
import cloudinary from '../config/cloudinary.js';

let storage;

if(process.env.NODE_ENV === 'production'){
    storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'uploads',
            allowed_formats: ['jpg', 'jpeg', 'png'],
            public_id: (req, file) => generateId(),
        }
    });
}else{
    storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, './public/uploads/');
        },
        filename: function(req, file, cb){
            cb(null, generateId() + path.extname(file.originalname));
        }
    });
}

const upload = multer({storage});
export default upload