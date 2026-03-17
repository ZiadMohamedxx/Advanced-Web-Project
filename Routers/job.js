import express from "express";
import {
  postJob,
  getMyJobs,
  getEmployerDashboard,
  updateApplicationStatus,
  getAllJobs,
  getJobById,
  applyForJob,
  getMyApplications,
  closeJob,
} from "../Controllers/job.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, postJob);
router.get("/my-jobs", authMiddleware, getMyJobs);
router.get("/dashboard", authMiddleware, getEmployerDashboard);
router.patch("/applications/:applicationId", authMiddleware, updateApplicationStatus);
router.get("/my-applications", authMiddleware, getMyApplications);
router.get("/", authMiddleware, getAllJobs);
router.get("/:jobId", authMiddleware, getJobById);
router.post("/:jobId/apply", authMiddleware, applyForJob);
router.patch("/:jobId/close", authMiddleware, closeJob);

export default router;