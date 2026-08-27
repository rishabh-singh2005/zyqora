import nodemailer from "nodemailer";
import dns from "dns";

// Force IPv4 resolution
dns.setDefaultResultOrder("ipv4first");

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: smtpPort === 587,

  family: 4,
  

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ==================== SMTP CONNECTION TEST ====================
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP CONNECTION FAILED:", error);
  } else {
    console.log("✅ SMTP SERVER IS READY");
  }
});

// ==================== SEND VERIFICATION EMAIL ====================
export const sendVerificationEmail = async (toEmail, token) => {
  try {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    console.log("========== EMAIL DEBUG ==========");
    console.log("Sending verification email to:", toEmail);
    console.log("SMTP Host:", process.env.SMTP_HOST);
    console.log("SMTP Port:", smtpPort);
    console.log("SMTP User:", process.env.SMTP_USER);
    console.log("Verification URL:", verifyUrl);

    const info = await transporter.sendMail({
      from: `"Zyqora" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Verify your email",
      html: `
        <p>Welcome! Please verify your email to activate your account.</p>
        <p>
          <a href="${verifyUrl}">
            Click here to verify
          </a>
        </p>
      `,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("================================");

    return info;

  } catch (error) {
    console.error("❌ EMAIL SENDING FAILED");
    console.error("Error:", error);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("================================");

    // Don't throw.
    // Signup should not fail because of email delivery.
    return null;
  }
};