import Application from "../Models/application.js";
import Job from "../Models/job.js";
import User from "../Models/user.js";
import { calculateCandidateJobScore } from "../utils/jobMatchingService.js";

export const applyToJob = async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;

    if (!candidateId || !jobId) {
      return res.status(400).json({
        message: "candidateId and jobId are required.",
      });
    }

    const candidate = await User.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(400).json({
        message: "Only candidates can apply for jobs.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    if (job.status !== "open") {
      return res.status(400).json({
        message: "This job is not open right now.",
      });
    }

    const existingApplication = await Application.findOne({
      candidate: candidateId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        application: existingApplication,
      });
    }

    const matchResult = calculateCandidateJobScore({
      candidate,
      job,
    });

    const application = await Application.create({
      candidate: candidateId,
      job: jobId,
      compatibilityScore: matchResult.score,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
      matchScore: matchResult.score,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      matchReasons: matchResult.matchReasons,
      accessibilityReasons: matchResult.accessibilityReasons,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied for this job.",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};