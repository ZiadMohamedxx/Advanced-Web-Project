import { simplifyText } from "../utils/aiService.js";
import Job from "../Models/job.js";

export const simplifyJob = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const simplified = await simplifyText(text);

    return res.json({ result: simplified });
  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.status(500).json({ message: "AI error" });
  }
};

export const matchCV = async (req, res) => {
  try {
    const { cvText } = req.body;

    if (!cvText) {
      return res.status(400).json({ message: "CV text is required" });
    }

    // 🧠 Step 1: normalize CV
    const text = cvText.toLowerCase();

    // 🧠 Step 2: extract skills (simple but clean)
    const knownSkills = [
      "javascript",
      "react",
      "node",
      "mongodb",
      "express",
      "html",
      "css",
      "typescript",
    ];

    const extractedSkills = knownSkills.filter((skill) =>
      text.includes(skill)
    );

    // 🧠 Step 3: get jobs
    const jobs = await Job.find({ status: "open" });

    // 🧠 Step 4: match scoring
    const matches = jobs.map((job) => {
      let score = 0;

      job.requiredSkills.forEach((skill) => {
        if (extractedSkills.includes(skill.toLowerCase())) {
          score += 20;
        }
      });

      return {
        jobId: job._id,
        title: job.title,
        company: job.industry || "Company",
        score: Math.min(score, 100),
      };
    });

    // 🧠 Step 5: sort
    const sorted = matches.sort((a, b) => b.score - a.score);

    return res.json({
      extractedSkills,
      matches: sorted.slice(0, 5),
    });
  } catch (error) {
    console.error("CV Matching Error:", error);
    return res.status(500).json({ message: "Matching failed" });
  }
};

export const matchSingleJob = async (req, res) => {
  try {
    const { cvText, jobId } = req.body;

    if (!cvText || !jobId) {
      return res.status(400).json({ message: "CV text and jobId are required" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const text = cvText.toLowerCase();

    const knownSkills = [
      "javascript",
      "react",
      "node",
      "mongodb",
      "express",
      "html",
      "css",
      "typescript",
    ];

    const extractedSkills = knownSkills.filter((skill) =>
      text.includes(skill)
    );

    let score = 0;

    job.requiredSkills.forEach((skill) => {
      if (extractedSkills.includes(skill.toLowerCase())) {
        score += 20;
      }
    });

    return res.json({
      score: Math.min(score, 100),
      extractedSkills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Match failed" });
  }
};