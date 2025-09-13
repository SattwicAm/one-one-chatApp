// utils/cloudinary.js or config/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ✅ Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, // e.g., 'your-cloud-name'
  api_key: process.env.CLOUDINARY_API_KEY, // e.g., '123456789012345'
  api_secret: process.env.CLOUDINARY_API_SECRET, // e.g., 'your-api-secret'
});

// ✅ Set up Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    //folder: "profile_pics", // Optional: create a folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allow common image formats
    transformation: [{ width: 200, height: 200, crop: "fill" }],
    public_id: (req, file) => `${req.user._id}_${Date.now()}`, // Optional: custom file name
  },
});

export { cloudinary, storage };
