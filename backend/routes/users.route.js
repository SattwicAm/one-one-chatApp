import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  deleteProfile,
  getAllUsers,
  setProfileImage,
} from "../controllers/users.controllers.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() }); // use memory storage
const router = express.Router();

router.get("/all", protect, getAllUsers); // GET /api/users/all
// Protect this route so only logged-in users can update their profile
router.put("/update/:id", protect, upload.single("avatar"), setProfileImage);

router.delete("/remove-avatar/:id", protect, deleteProfile);

export default router;
