import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from "../cloudinary/cloudinary.js"

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your_folder_name', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }
});

const upload = multer({ storage });

export default upload;
