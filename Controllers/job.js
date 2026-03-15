import Job from "../Models/Job.js";
import Application from "../Models/application.js";
import User from "../Models/user.js";

// ─── EMPLOYER: Post a new job ─────────────────────────────────────────────────
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      workType,
      requiredSkills,
      physicalRequirements,
      disabilityAccommodations,
      industry,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const job = await Job.create({
      employer: req.userId, // set by auth middleware
      title,
      description,
      location: location || "",
      workType: workType || "onsite",
      requiredSkills: requiredSkills ? requiredSkills.split(",").map((s) => s.trim()) : [],
      physicalRequirements: physicalRequirements || "",
      disabilityAccommodations: disabilityAccommodations || "",
      industry: industry || "",
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── EMPLOYER: Get all jobs posted by this employer ──────────────────────────
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── EMPLOYER: Get dashboard — jobs + applicants per job ─────────────────────
export const getEmployerDashboard = async (req, res) => {
  try {
    // All jobs by this employer
    const jobs = await Job.find({ employer: req.userId }).sort({ createdAt: -1 });

    // For each job, get applications with full candidate info
    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id })
          .populate("candidate", "name email phone disabilityType preferredAccommodations cvPath")
          .sort({ compatibilityScore: -1 });

        return {
          job,
          applicants: applications,
          totalApplicants: applications.length,
        };
      })
    );

    res.status(200).json({ dashboard: jobsWithApplicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── EMPLOYER: Update application status (accept / reject) ───────────────────
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'accepted' or 'rejected'." });
    }

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Make sure this employer owns the job
    if (application.job.employer.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CANDIDATE: Get all open jobs ─────────────────────────────────────────────
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("employer", "name companyName industry")
      .sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CANDIDATE: Apply for a job ───────────────────────────────────────────────
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.status === "closed") return res.status(400).json({ message: "This job is closed." });

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, candidate: req.userId });
    if (existing) return res.status(400).json({ message: "You have already applied for this job." });

    // Simple compatibility score based on disability accommodations match
    const candidate = await User.findById(req.userId);
    let score = Math.floor(Math.random() * 30) + 60; // placeholder 60-90 until AI engine is ready

    const application = await Application.create({
      job: jobId,
      candidate: req.userId,
      compatibilityScore: score,
    });

    res.status(201).json({ message: "Application submitted successfully!", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CANDIDATE: Get my applications ──────────────────────────────────────────
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.userId })
      .populate("job", "title location workType industry employer")
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
