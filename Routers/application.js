import express from "express";
import { applyToJob } from "../Controllers/application.js";

const router = express.Router();

router.post("/apply", applyToJob);

export default router;