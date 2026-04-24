import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"InclusiveHire" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "",   // fallback
      html: html || "",   // ✅ IMPORTANT
    });

    console.log("Email sent successfully");

  } catch (error) {
    console.log("Email error:", error.message);
  }
};

export default sendEmail;