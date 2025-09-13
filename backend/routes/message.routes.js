import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protect, sendMessage); // send a new message
router.get("/:userId", protect, getMessages); // get messages with a specific user

//update and delete message
router.put("/:id", protect, updateMessage);
router.delete("/:id", protect, deleteMessage);

export default router;
