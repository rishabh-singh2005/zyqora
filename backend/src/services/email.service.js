import sgMail from "@sendgrid/mail";

// ==================== SENDGRID CONFIGURATION ====================
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
} else {
  console.warn("⚠️ [EmailService] SENDGRID_API_KEY is not defined in environment variables. Outbound emails will be skipped.");
}

const getSenderDetails = () => {
  const email = process.env.SENDGRID_FROM_EMAIL || "no-reply@zyqora.com";
  const name = process.env.SENDGRID_FROM_NAME || "Zyqora";
  return { email, name };
};

// ==================== GET CLIENT FRONTEND URL ====================
/**
 * Intelligently determines the frontend URL for links and redirects.
 * Prioritizes request origin header, then CLIENT_URL, then production entries from CLIENT_URLS.
 * 
 * @param {string} [clientOrigin] - Origin or referer header from incoming request
 * @returns {string} Fully-qualified frontend URL without trailing slash
 */
export const getClientUrl = (clientOrigin = "") => {
  // 1. If explicit clientOrigin provided from request header
  if (clientOrigin && typeof clientOrigin === "string") {
    const trimmed = clientOrigin.trim().replace(/\/+$/, "");
    if (trimmed && (process.env.NODE_ENV !== "production" || (!trimmed.includes("localhost") && !trimmed.includes("127.0.0.1")))) {
      return trimmed;
    }
  }

  // 2. Direct process.env.CLIENT_URL
  if (process.env.CLIENT_URL) {
    const trimmed = process.env.CLIENT_URL.trim().replace(/\/+$/, "");
    if (trimmed) return trimmed;
  }

  // 3. From process.env.CLIENT_URLS (find production URL first)
  if (process.env.CLIENT_URLS) {
    const urls = process.env.CLIENT_URLS.split(",")
      .map((u) => u.trim().replace(/\/+$/, ""))
      .filter(Boolean);
    const prodUrl = urls.find((u) => !u.includes("localhost") && !u.includes("127.0.0.1"));
    if (prodUrl) return prodUrl;
    if (urls.length > 0) return urls[0];
  }

  // 4. Default fallback
  return "http://localhost:5173";
};

// ==================== SEND VERIFICATION EMAIL ====================
/**
 * Sends an email verification link to the newly registered or unverified user.
 * Designed to never throw unhandled exceptions so auth flows remain resilient.
 * 
 * @param {string} toEmail - Recipient email address
 * @param {string} token - Unique verification UUID token
 * @param {string} [recipientName] - Optional recipient display name
 * @param {string} [clientOrigin] - Optional request origin to guarantee deployed domain links
 * @returns {Promise<{success: boolean, messageId?: string, error?: string, skipped?: boolean}>}
 */
export const sendVerificationEmail = async (toEmail, token, recipientName = "", clientOrigin = "") => {
  const clientUrl = getClientUrl(clientOrigin);
  const verifyUrl = `${clientUrl}/verify-email/${token}`;
  const sender = getSenderDetails();

  if (!process.env.SENDGRID_API_KEY) {
    console.warn(`⚠️ [EmailService] Skipping verification email to ${toEmail} because SENDGRID_API_KEY is not set.`);
    return {
      success: false,
      skipped: true,
      error: "SENDGRID_API_KEY is not configured",
    };
  }

  const displayName = recipientName ? recipientName.trim() : "there";

  const mailOptions = {
    to: toEmail,
    from: {
      email: sender.email,
      name: sender.name,
    },
    subject: "Verify your Zyqora account",
    text: `Hi ${displayName},\n\nThank you for signing up for Zyqora!\n\nPlease verify your email address by opening the following link:\n${verifyUrl}\n\nIf you did not sign up for Zyqora, you can safely ignore this email.\n\nBest regards,\nThe Zyqora Team`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your Zyqora account</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #0f172a; padding: 28px 36px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">ZYQORA</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 36px 36px 24px 36px;">
                    <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 600;">Welcome, ${displayName}! 👋</h2>
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                      Thank you for joining Zyqora. Please verify your email address to activate your account and start exploring our catalog.
                    </p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${verifyUrl}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.25);">
                        Verify My Email
                      </a>
                    </div>

                    <p style="margin: 24px 0 8px 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                      If the button above does not work, copy and paste this link into your web browser:
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 13px; word-break: break-all; color: #2563eb;">
                      <a href="${verifyUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${verifyUrl}</a>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
                    
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                      If you did not create a Zyqora account, no further action is needed and you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px 36px; text-align: center; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      © ${new Date().getFullYear()} Zyqora E-Commerce. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    console.log(`[EmailService] Dispatching verification email to ${toEmail} with URL: ${verifyUrl}`);
    const [response] = await sgMail.send(mailOptions);
    const messageId = response?.headers?.["x-message-id"] || "sent";

    console.log(`✅ [EmailService] Verification email sent to ${toEmail} (Status: ${response.statusCode}, Message ID: ${messageId})`);
    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error("❌ [EmailService] Failed to send verification email via SendGrid");
    if (error.response) {
      console.error(`Status: ${error.response.statusCode}`);
      console.error("SendGrid Errors:", JSON.stringify(error.response.body?.errors || error.response.body, null, 2));
    } else {
      console.error("Error Message:", error.message);
    }

    return {
      success: false,
      error: error.message || "Failed to deliver email via SendGrid",
    };
  }
};