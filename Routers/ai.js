import express from "express";
import { simplifyJob, matchCV, matchSingleJob } from "../Controllers/aiController.js";

const router = express.Router();

router.post("/simplify", simplifyJob);
router.post("/match-cv", matchCV);
router.post("/match-job", matchSingleJob);

export default router;