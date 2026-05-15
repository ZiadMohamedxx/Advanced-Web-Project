import express from "express";
import { chatWithAI } from "../Controllers/aiChatController.js";

const router = express.Router();

router.post("/chat", chatWithAI);

export default router;