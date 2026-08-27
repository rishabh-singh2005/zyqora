import nodemailer from "nodemailer";
import dns from "dns";

// Force IPv4 resolution - Render's network has issues reaching Gmail via IPv6
dns.setDefaultResultOrder("ipv4first");

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: smtpPort === 587,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ==================== SEND VERIFICATION EMAIL ====================
export const sendVerificationEmail = async (toEmail, token) => {
  try {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await transporter.sendMail({
      from: `"Zyqora" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Verify your email",
      html: `
        <p>Welcome! Please verify your email to activate your account.</p>
        <a href="${verifyUrl}">Click here to verify</a>
      `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
    // Don't throw — a failed email shouldn't break signup/login
  }
};