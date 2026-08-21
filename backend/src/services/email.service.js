import nodemailer from "nodemailer";

// ==================== TRANSPORTER SETUP ====================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ==================== SEND VERIFICATION EMAIL ====================
export const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"Ecommerce App" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Verify your email",
    html: `
      <p>Welcome! Please verify your email to activate your account.</p>
      <a href="${verifyUrl}">Click here to verify</a>
    `,
  });
};