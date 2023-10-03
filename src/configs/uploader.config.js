// Import essential modules
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import createError from "http-errors";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Invoke config function
config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploader
const uploader = (
  subfolder_path,
  allowed_file_types,
  max_file_size,
  error_msg
) => {
  // Storage
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: subfolder_path,
      use_filename: true,
      public_id: (req, file) => {
        const filename = path.parse(file.originalname).name;
        return `${filename}-${uuidv4()}`;
      },
    },
  });

  // Upload object
  const upload = multer({
    storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  return upload;
};

// Export uploader
export default uploader;
