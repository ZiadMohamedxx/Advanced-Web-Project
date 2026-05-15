import Job from "../Models/job.js";
import { extractCVDataWithAI, fallbackExtractCVData } from "./aiService.js";

const normalize = (value = "") => value.toString().toLowerCase().trim();

const uniqueArray = (items = []) => {
  return [
    ...new Set(
      items
        .filter(Boolean)
        .map((item) => item.toString().trim())
        .filter(Boolean)
    ),
  ];
};

const includesAny = (text = "", words = []) => {
  const normalizedText = normalize(text);

  return words.some((word) => {
    const normalizedWord = normalize(word);
    return normalizedWord && normalizedText.includes(normalizedWord);
  });
};

const getAccessibilityReasons = (
  job,
  disabilityType = "",
  preferredAccommodations = ""
) => {
  const reasons = [];

  const type = normalize(disabilityType);
  const accommodations = normalize(job.disabilityAccommodations);
  const workType = normalize(job.workType);
  const physicalRequirements = normalize(job.physicalRequirements);
  const preferred = normalize(preferredAccommodations);

  if (workType === "remote") {
    reasons.push("Remote work is available");
  }

  if (workType === "hybrid") {
    reasons.push("Hybrid work is available");
  }

  if (accommodations.includes("remote")) {
    reasons.push("Remote-friendly environment is mentioned");
  }

  if (accommodations.includes("hybrid")) {
    reasons.push("Hybrid work support is mentioned");
  }

  if (accommodations.includes("flexible")) {
    reasons.push("Flexible work support is mentioned");
  }

  if (accommodations.includes("accessible")) {
    reasons.push("Accessible work environment is mentioned");
  }

  if (
    accommodations.includes("wheelchair") ||
    accommodations.includes("mobility")
  ) {
    reasons.push("Mobility accessibility support is mentioned");
  }

  if (accommodations.includes("assistive")) {
    reasons.push("Assistive support is mentioned");
  }

  if (
    type === "mobility" &&
    (workType === "remote" || workType === "hybrid")
  ) {
    reasons.push("The work type may reduce mobility barriers");
  }

  if (
    type === "visual" &&
    includesAny(accommodations, [
      "screen reader",
      "large text",
      "high contrast",
      "assistive",
    ])
  ) {
    reasons.push("The job mentions visual accessibility accommodations");
  }

  if (
    type === "hearing" &&
    includesAny(accommodations, [
      "caption",
      "written communication",
      "visual cues",
    ])
  ) {
    reasons.push("The job mentions hearing-friendly communication support");
  }

  if (
    type === "cognitive" &&
    includesAny(accommodations, [
      "simple",
      "clear instructions",
      "flexible",
      "quiet",
    ])
  ) {
    reasons.push("The job mentions cognitive-friendly accommodations");
  }

  if (preferred && includesAny(accommodations, preferred.split(/[,\n]/))) {
    reasons.push("The job accommodations match your preferred accommodations");
  }

  if (!physicalRequirements || physicalRequirements.includes("none")) {
    reasons.push("No strict physical requirements are mentioned");
  }

  return uniqueArray(reasons).slice(0, 4);
};

export const calculateJobMatch = ({
  job,
  cvData,
  disabilityType,
  preferredAccommodations,
}) => {
  const safeCvData = cvData || {};

  const cvSkills = uniqueArray(safeCvData.skills || []).map(normalize);

  const cvKeywords = uniqueArray([
    ...(safeCvData.keywords || []),
    ...(safeCvData.jobTitles || []),
    ...(safeCvData.education || []),
    ...(safeCvData.languages || []),
    ...(safeCvData.skills || []),
  ]).map(normalize);

  const requiredSkills = uniqueArray(job.requiredSkills || []).map(normalize);

  const matchedSkills = requiredSkills.filter((skill) =>
    cvSkills.some(
      (candidateSkill) =>
        candidateSkill === skill ||
        candidateSkill.includes(skill) ||
        skill.includes(candidateSkill)
    )
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  let score = 0;
  const matchReasons = [];

  // 1) Skills are the strongest part of the real score: 60 points
  if (requiredSkills.length > 0) {
    const skillScore = Math.round(
      (matchedSkills.length / requiredSkills.length) * 60
    );

    score += skillScore;

    if (matchedSkills.length > 0) {
      matchReasons.push(
        `Your CV includes ${matchedSkills.slice(0, 5).join(", ")}`
      );
    }
  }

  // 2) Title / description / industry keyword relevance: 15 points
  const jobSearchText = normalize(
    `${job.title} ${job.description} ${job.industry} ${(job.requiredSkills || []).join(" ")}`
  );

  const keywordMatches = cvKeywords.filter(
    (keyword) => keyword && jobSearchText.includes(keyword)
  );

  if (keywordMatches.length > 0) {
    score += Math.min(keywordMatches.length * 5, 15);
    matchReasons.push("Your CV keywords match this role");
  }

  // 3) Experience support: 5 points
  if (Number(safeCvData.experienceYears) > 0) {
    score += Math.min(Number(safeCvData.experienceYears) * 2, 5);
    matchReasons.push("Your experience supports this match");
  }

  // 4) Education support: 5 points
  if ((safeCvData.education || []).length > 0) {
    score += 5;
    matchReasons.push("Your education supports this match");
  }

  // 5) Accessibility fit: 15 points
  const accessibilityReasons = getAccessibilityReasons(
    job,
    disabilityType,
    preferredAccommodations
  );

  if (accessibilityReasons.length > 0) {
    score += Math.min(accessibilityReasons.length * 4, 15);
  }

  const finalScore = Math.max(0, Math.min(Math.round(score), 100));

  if (matchReasons.length === 0) {
    matchReasons.push("No strong CV skill match was detected for this role");
  }

  return {
    score: finalScore,
    matchedSkills,
    missingSkills,
    matchReasons: uniqueArray(matchReasons).slice(0, 4),
    accessibilityReasons:
      accessibilityReasons.length > 0
        ? accessibilityReasons
        : ["No specific accessibility match was detected"],
  };
};

export const formatMatchedJob = ({ job, matchResult }) => {
  const plainJob = typeof job.toObject === "function" ? job.toObject() : job;

  return {
    ...plainJob,
    matchScore: matchResult.score,
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,
    matchReasons: matchResult.matchReasons,
    accessibilityReasons: matchResult.accessibilityReasons,
    canApplyNow: true,
  };
};

export const getMatchingJobsForCandidate = async ({
  candidate,
  cvText = "",
  limit = 10,
}) => {
  let cvData;

  try {
    cvData = await extractCVDataWithAI(cvText);
  } catch {
    cvData = fallbackExtractCVData(cvText);
  }

  const jobs = await Job.find({
    $or: [{ status: "open" }, { status: { $exists: false } }],
  })
    .populate("employer", "name companyName industry")
    .sort({ createdAt: -1 });

  console.log("MATCHING DEBUG - CV TEXT LENGTH:", cvText.length);
  console.log("MATCHING DEBUG - EXTRACTED CV DATA:", cvData);
  console.log("MATCHING DEBUG - OPEN JOBS COUNT:", jobs.length);

  const matchingJobs = jobs
    .map((job) => {
      const result = calculateJobMatch({
        job,
        cvData,
        disabilityType: candidate.disabilityType,
        preferredAccommodations: candidate.preferredAccommodations,
      });

      return {
        jobId: job._id,
        title: job.title,
        companyName:
          job.employer?.companyName || job.employer?.name || "Company",
        location: job.location || "Not specified",
        jobType: job.workType || "onsite",
        matchScore: result.score,
        matchReasons: result.matchReasons,
        accessibilityReasons: result.accessibilityReasons,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        canApplyNow: true,
      };
    })
    .sort((a, b) => {
      const aMatchedCount = a.matchedSkills?.length || 0;
      const bMatchedCount = b.matchedSkills?.length || 0;

      if (bMatchedCount !== aMatchedCount) {
        return bMatchedCount - aMatchedCount;
      }

      return b.matchScore - a.matchScore;
    })
    .slice(0, limit);

  console.log("MATCHING DEBUG - RETURNED MATCHES:", matchingJobs.length);

  return {
    cvData,
    matchingJobs,
  };
};

export const getAllJobsWithCandidateMatches = async ({ candidate }) => {
  const jobs = await Job.find({
    $or: [{ status: "open" }, { status: { $exists: false } }],
  })
    .populate("employer", "name companyName industry")
    .sort({ createdAt: -1 });

  const cvData = candidate.cvExtractedData || {};

  const jobsWithMatches = jobs
    .map((job) => {
      const matchResult = calculateJobMatch({
        job,
        cvData,
        disabilityType: candidate.disabilityType,
        preferredAccommodations: candidate.preferredAccommodations,
      });

      return formatMatchedJob({
        job,
        matchResult,
      });
    })
    .sort((a, b) => {
      const aMatchedCount = a.matchedSkills?.length || 0;
      const bMatchedCount = b.matchedSkills?.length || 0;

      if (bMatchedCount !== aMatchedCount) {
        return bMatchedCount - aMatchedCount;
      }

      return b.matchScore - a.matchScore;
    });

  return jobsWithMatches;
};

export const calculateCandidateJobScore = ({ candidate, job }) => {
  const matchResult = calculateJobMatch({
    job,
    cvData: candidate.cvExtractedData || {},
    disabilityType: candidate.disabilityType,
    preferredAccommodations: candidate.preferredAccommodations,
  });

  return matchResult;
};