import fetch from "node-fetch";

const fallbackSimplify = (text) => {
  return (
    text
      .replace(/develop/gi, "make")
      .replace(/build/gi, "make")
      .replace(/create/gi, "make")
      .replace(/applications/gi, "apps")
      .replace(/systems/gi, "tools")
      .replace(/interfaces/gi, "pages")
      .replace(/using/gi, "with")
      .replace(/\s+/g, " ")
      .trim() + " (simplified)"
  );
};

export const simplifyText = async (text) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Simplify job descriptions into very short and easy sentences.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("AI quota exceeded -> using fallback");
      return fallbackSimplify(text);
    }

    return data?.choices?.[0]?.message?.content || fallbackSimplify(text);
  } catch (error) {
    console.log("AI error -> using fallback");
    return fallbackSimplify(text);
  }
};

const safeJsonParse = (value) => {
  try {
    const cleaned = value
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const valueToString = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const parts = [];

    if (value.degree) parts.push(value.degree);
    if (value.institution) parts.push(value.institution);
    if (value.school) parts.push(value.school);
    if (value.university) parts.push(value.university);
    if (value.field) parts.push(value.field);
    if (value.major) parts.push(value.major);
    if (value.location) parts.push(value.location);
    if (value.year) parts.push(value.year);

    if (parts.length > 0) {
      return parts.join(" - ").trim();
    }

    return Object.values(value)
      .filter(Boolean)
      .map((item) => item.toString().trim())
      .join(" - ");
  }

  return "";
};

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value
        .map(valueToString)
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ];
};

const normalizeCVData = (data = {}) => {
  return {
    skills: normalizeStringArray(data.skills),
    experienceYears: Number(data.experienceYears) || 0,
    education: normalizeStringArray(data.education),
    jobTitles: normalizeStringArray(data.jobTitles),
    languages: normalizeStringArray(data.languages),
    seniorityLevel:
      typeof data.seniorityLevel === "string" ? data.seniorityLevel : "",
    keywords: normalizeStringArray(data.keywords),
  };
};

export const fallbackExtractCVData = (cvText = "") => {
  const text = cvText.toLowerCase();

  const knownSkills = [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "node",
    "node.js",
    "express",
    "mongodb",
    "mongoose",
    "sql",
    "mysql",
    "python",
    "java",
    "c++",
    "c#",
    "git",
    "github",
    "tailwind",
    "tailwind css",
    "bootstrap",
    "figma",
    "ui",
    "ux",
    "api",
    "rest",
    "rest api",
    "redux",
    "next.js",
    "angular",
    "vue",
    "php",
    "laravel",
    "responsive design",
    "accessibility",
    "problem solving",
    "communication",
    "teamwork",
  ];

  const skills = knownSkills.filter((skill) =>
    text.includes(skill.toLowerCase())
  );

  const experienceMatch = text.match(/(\d+)\+?\s*(years|year|yrs|yr)/i);
  const experienceYears = experienceMatch ? Number(experienceMatch[1]) : 0;

  const education = [];

  if (text.includes("bachelor")) education.push("Bachelor");
  if (text.includes("master")) education.push("Master");
  if (text.includes("computer science")) education.push("Computer Science");
  if (text.includes("information system")) education.push("Information Systems");
  if (text.includes("software engineering")) education.push("Software Engineering");

  const jobTitles = [];

  if (text.includes("frontend")) jobTitles.push("Frontend Developer");
  if (text.includes("front-end")) jobTitles.push("Frontend Developer");
  if (text.includes("backend")) jobTitles.push("Backend Developer");
  if (text.includes("back-end")) jobTitles.push("Backend Developer");
  if (text.includes("full stack") || text.includes("fullstack")) {
    jobTitles.push("Full Stack Developer");
  }
  if (text.includes("designer")) jobTitles.push("Designer");
  if (text.includes("data analyst")) jobTitles.push("Data Analyst");
  if (text.includes("qa")) jobTitles.push("QA Tester");
  if (text.includes("testing")) jobTitles.push("QA Testing Engineer");

  const languages = [];

  if (text.includes("english")) languages.push("English");
  if (text.includes("arabic")) languages.push("Arabic");

  return normalizeCVData({
    skills,
    experienceYears,
    education,
    jobTitles,
    languages,
    seniorityLevel: experienceYears >= 3 ? "mid" : "junior",
    keywords: [...new Set([...skills, ...education, ...jobTitles])],
  });
};

export const extractCVDataWithAI = async (cvText = "") => {
  if (!cvText || !cvText.trim()) {
    return fallbackExtractCVData("");
  }

  if (!process.env.OPENAI_API_KEY) {
    return fallbackExtractCVData(cvText);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content:
              'Extract structured CV data. Return JSON only with this exact shape: {"skills":[],"experienceYears":0,"education":[],"jobTitles":[],"languages":[],"seniorityLevel":"","keywords":[]}. All arrays must contain strings only. No objects inside arrays. No markdown. No explanation.',
          },
          {
            role: "user",
            content: cvText.slice(0, 12000),
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("CV AI extraction failed -> using fallback");
      return fallbackExtractCVData(cvText);
    }

    const content = data?.choices?.[0]?.message?.content || "";
    const parsed = safeJsonParse(content);

    if (!parsed) {
      return fallbackExtractCVData(cvText);
    }

    return normalizeCVData(parsed);
  } catch (error) {
    console.log("CV AI extraction error -> using fallback");
    return fallbackExtractCVData(cvText);
  }
};