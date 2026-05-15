export const chatWithAI = async (req, res) => {
  try {
    const { message, settings } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const msg = message.toLowerCase().trim();
    const disabilityType = settings?.disabilityType || "none";

    let reply = "";

    if (msg.includes("apply")) {
      reply =
        "To apply for a job, open the job details, review the requirements, then click Apply and complete the form carefully.";
    } else if (msg.includes("simplify")) {
      reply =
        "This page shows jobs. You can search for a role, view details, and apply. The simplify feature makes job descriptions easier to understand.";
    } else if (
      msg.includes("accessibility") ||
      msg.includes("settings") ||
      msg.includes("recommend")
    ) {
      reply =
        "You can use High Contrast, Large Text, Large Targets, and Simple Mode from the A11Y button depending on your needs.";
    } else if (msg.includes("job")) {
      reply =
        "You can browse available jobs, read descriptions, simplify them with AI, and apply directly from the jobs page.";
    } else if (msg.includes("profile")) {
      reply =
        "You can update your profile information, skills, and preferences from the profile section.";
    } else if (msg.includes("help")) {
      reply =
        "I can help you understand job descriptions, explain pages, suggest accessibility settings, and guide you through applying.";
    } else {
      reply =
        "I understand your request. Try asking me about jobs, applications, profile, or accessibility settings.";
    }

    if (disabilityType === "visual") {
      reply +=
        " Since you selected visual impairment, I recommend using high contrast and large text.";
    } else if (disabilityType === "hearing") {
      reply +=
        " Since you selected hearing impairment, visual cues and captions are recommended.";
    } else if (disabilityType === "motor") {
      reply +=
        " Since you selected motor impairment, large buttons and simpler navigation are recommended.";
    } else if (disabilityType === "cognitive") {
      reply +=
        " Since you selected cognitive disability, simple mode and short instructions are recommended.";
    }

    return res.json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({ message: "AI error" });
  }
};