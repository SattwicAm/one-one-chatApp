// routes/group.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import { createGroup } from "../controllers/group.controller.js";
import { getGroupMessages } from "../controllers/group.controller.js";
import { getAllGroups } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", protect, createGroup);
router.get("/", protect, getAllGroups);
router.get("/:groupId/messages", protect, getGroupMessages);

export default router;
