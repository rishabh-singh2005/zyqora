import nodemailer from "nodemailer";

// ==================== TRANSPORTER SETUP ====================
const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  // Port 465 uses an immediate TLS connection. Gmail's recommended port 587
  // upgrades the connection with STARTTLS instead.
  secure: smtpPort === 465,
  requireTLS: smtpPort === 587,
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
