import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ==================== SEND VERIFICATION EMAIL ====================
export const sendVerificationEmail = async (toEmail, token) => {
  try {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    console.log("========== EMAIL DEBUG ==========");
    console.log("Sending verification email to:", toEmail);
    console.log("Verification URL:", verifyUrl);

    const { data, error } = await resend.emails.send({
      from: `Zyqora <${process.env.RESEND_FROM_EMAIL}>`,
      to: [toEmail],
      subject: "Verify your Zyqora account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          
          <h2 style="color: #222;">
            Welcome to Zyqora!
          </h2>

          <p>
            Thanks for creating your account.
            Please verify your email address to activate your account.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${verifyUrl}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #000;
                color: #fff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              "
            >
              Verify My Email
            </a>
          </div>

          <p style="font-size: 14px; color: #666;">
            If you did not create a Zyqora account, you can safely ignore this email.
          </p>

          <p style="font-size: 13px; color: #999;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>

          <p style="font-size: 13px; word-break: break-all;">
            ${verifyUrl}
          </p>

        </div>
      `,
    });

    if (error) {
      console.error("❌ RESEND EMAIL FAILED");
      console.error("Error:", error);

      return null;
    }

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("Resend response:", data);
    console.log("Message ID:", data?.id);
    console.log("================================");

    return data;

  } catch (error) {
    console.error("❌ RESEND EMAIL ERROR");
    console.error("Error:", error);
    console.error("Message:", error.message);
    console.error("================================");

    return null;
  }
};