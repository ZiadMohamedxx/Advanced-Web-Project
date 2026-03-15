import express from "express";
import {
  postJob,
  getMyJobs,
  getEmployerDashboard,
  updateApplicationStatus,
  getAllJobs,
  applyForJob,
  getMyApplications,
} from "../Controllers/job.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

// ─── Employer routes ──────────────────────────────────────────────────────────
router.post("/", authMiddleware, postJob);                                        // POST   /jobs
router.get("/my-jobs", authMiddleware, getMyJobs);                                // GET    /jobs/my-jobs
router.get("/dashboard", authMiddleware, getEmployerDashboard);                   // GET    /jobs/dashboard
router.patch("/applications/:applicationId", authMiddleware, updateApplicationStatus); // PATCH  /jobs/applications/:id

// ─── Candidate routes ─────────────────────────────────────────────────────────
router.get("/", authMiddleware, getAllJobs);                                       // GET    /jobs
router.post("/:jobId/apply", authMiddleware, applyForJob);                        // POST   /jobs/:jobId/apply
router.get("/my-applications", authMiddleware, getMyApplications);                // GET    /jobs/my-applications

export default router;