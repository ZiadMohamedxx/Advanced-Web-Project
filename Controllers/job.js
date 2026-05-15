import Job from "../Models/job.js";
import Application from "../Models/application.js";
import User from "../Models/user.js";
import sendEmail from "../utils/sendEmail.js";
import {
  getAllJobsWithCandidateMatches,
  calculateCandidateJobScore,
} from "../utils/jobMatchingService.js";

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
      return res.status(400).json({
        message: "Title and description are required.",
      });
    }

    const job = await Job.create({
      employer: req.userId,
      title,
      description,
      location: location || "",
      workType: workType || "onsite",
      requiredSkills: requiredSkills
        ? requiredSkills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [],
      physicalRequirements: physicalRequirements || "",
      disabilityAccommodations: disabilityAccommodations || "",
      industry: industry || "",
    });

    res.status(201).json({
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ─── EMPLOYER: Get all jobs posted by this employer ──────────────────────────
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const buildApplicationWithRealMatch = async ({ application, job }) => {
  const appObject =
    typeof application.toObject === "function"
      ? application.toObject()
      : application;

  let matchResult = {
    score: Number(appObject.compatibilityScore) || 0,
    matchedSkills: [],
    missingSkills: [],
    matchReasons: ["No CV match data available for this candidate"],
    accessibilityReasons: ["No accessibility match data available"],
  };

  if (appObject.candidate && appObject.candidate.role !== "corporate") {
    matchResult = calculateCandidateJobScore({
      candidate: appObject.candidate,
      job,
    });
  }

  if (application.compatibilityScore !== matchResult.score) {
    application.compatibilityScore = matchResult.score;
    await application.save();
  }

  return {
    ...appObject,
    compatibilityScore: matchResult.score,
    realMatchScore: matchResult.score,
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,
    matchReasons: matchResult.matchReasons,
    accessibilityReasons: matchResult.accessibilityReasons,
  };
};

// ─── EMPLOYER: Get dashboard — jobs + applicants per job with real AI match ───
export const getEmployerDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.userId }).sort({
      createdAt: -1,
    });

    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id })
          .populate(
            "candidate",
            "name email phone role disabilityType preferredAccommodations cvPath cvExtractedData"
          )
          .sort({ compatibilityScore: -1 });

        const applicationsWithRealMatches = await Promise.all(
          applications.map((application) =>
            buildApplicationWithRealMatch({
              application,
              job,
            })
          )
        );

        applicationsWithRealMatches.sort(
          (a, b) => (b.realMatchScore || 0) - (a.realMatchScore || 0)
        );

        return {
          job,
          applicants: applicationsWithRealMatches,
          totalApplicants: applicationsWithRealMatches.length,
        };
      })
    );

    res.status(200).json({
      dashboard: jobsWithApplicants,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ─── EMPLOYER: Update application status (accept / reject) ───────────────────
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be 'accepted' or 'rejected'.",
      });
    }

    const application = await Application.findById(applicationId).populate(
      "job"
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    if (application.job.employer.toString() !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized.",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: `Application ${status}`,
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ─── EMPLOYER: Close a job ────────────────────────────────────────────────────
export const closeJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    if (job.employer.toString() !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized.",
      });
    }

    job.status = "closed";
    await job.save();

    res.status(200).json({
      message: "Job closed successfully.",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ─── EMPLOYER: Reopen a job ──────────────────────────────────────────────────
export const reopenJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    if (job.employer.toString() !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized.",
      });
    }

    job.status = "open";
    await job.save();

    res.status(200).json({
      message: "Job reopened successfully.",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ─── PUBLIC/AUTHED: Get all open jobs ─────────────────────────────────────────
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      $or: [{ status: "open" }, { status: { $exists: false } }],
    })
      .populate("employer", "name companyName industry")
      .sort({ createdAt: -1 });

    res.status(200).json({
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ─── CANDIDATE: Get all jobs with CV match percentage ─────────────────────────
export const getJobsWithMyMatches = async (req, res) => {
  try {
    const candidate = await User.findById(req.userId);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found.",
      });
    }

    if (candidate.role !== "candidate") {
      const jobs = await Job.find({
        $or: [{ status: "open" }, { status: { $exists: false } }],
      })
        .populate("employer", "name companyName industry")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        jobs,
        hasMatchData: false,
      });
    }

    const jobs = await getAllJobsWithCandidateMatches({
      candidate,
    });

    return res.status(200).json({
      jobs,
      hasMatchData: true,
      cvExtractedData: candidate.cvExtractedData || null,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ─── CANDIDATE: Apply for a job with real AI compatibility score ─────────────
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("employer");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    if (job.status === "closed") {
      return res.status(400).json({
        message: "This job is closed.",
      });
    }

    const existing = await Application.findOne({
      job: jobId,
      candidate: req.userId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied for this job.",
      });
    }

    const candidate = await User.findById(req.userId);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can apply for jobs.",
      });
    }

    const matchResult = calculateCandidateJobScore({
      candidate,
      job,
    });

    const application = await Application.create({
      job: jobId,
      candidate: req.userId,
      compatibilityScore: matchResult.score,
    });

    if (job.employer?.email) {
      await sendEmail({
        to: job.employer.email,
        subject: `New application for ${job.title}`,
        html: `
          <h2>New Application</h2>
          <p>${candidate.name} applied for <b>${job.title}</b></p>
          <p>Email: ${candidate.email}</p>
          <p>Compatibility Score: ${matchResult.score}%</p>
        `,
      });
    }

    if (candidate.email) {
      const companyName =
        job.employer?.companyName || job.employer?.name || "Company";

      await sendEmail({
        to: candidate.email,
        subject: "Application Received",
        html: `
          <h2>Application Received</h2>
          <p>You applied for <b>${job.title}</b> at <b>${companyName}</b></p>
          <p>Your match score for this job is <b>${matchResult.score}%</b>.</p>
        `,
      });
    }

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
      matchScore: matchResult.score,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      matchReasons: matchResult.matchReasons,
      accessibilityReasons: matchResult.accessibilityReasons,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ─── CANDIDATE: Get my applications ──────────────────────────────────────────
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.userId })
      .populate("job", "title location workType industry employer")
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ─── Get job by id ────────────────────────────────────────────────────────────
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate(
      "employer",
      "name companyName industry"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};