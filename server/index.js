require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const nodemailer = require("nodemailer");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
  methods: ["POST", "OPTIONS"],
}));

// ── Nodemailer transporter (Gmail SMTP) ─────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,   // 16-char App Password
  },
});

// ── Verify connection on startup ─────────────────────────────────────────────
transporter.verify((err) => {
  if (err) {
    console.error("❌  Email transporter error:", err.message);
  } else {
    console.log("✅  Email server ready — connected to Gmail SMTP");
  }
});

// ── Helper: format a date string nicely ─────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return "Not specified";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ── Professional HTML email template ─────────────────────────────────────────
function buildEmailHTML({ name, email, phone, country, travelDate, travellers, message, submittedAt, enquiryType }) {
  const displayType = enquiryType === 'Tour Package' ? 'Package' : enquiryType;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${enquiryType} Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#f0f3f8;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#06294e 0%,#0b4a7a 60%,#0d5e99 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:0.5px;">
              ✈️ Fremor Global
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
              New ${enquiryType} Enquiry Received
            </p>
          </td>
        </tr>

        <!-- ALERT BADGE -->
        <tr>
          <td style="padding:24px 40px 0;text-align:center;">
            <span style="display:inline-block;background:#fff3cd;color:#856404;border:1px solid #ffc107;padding:8px 20px;border-radius:24px;font-size:13px;font-weight:600;">
              🔔 New enquiry for <strong>${country}</strong> ${displayType}
            </span>
          </td>
        </tr>

        <!-- ENQUIRY DETAILS -->
        <tr>
          <td style="padding:28px 40px 0;">
            <h2 style="margin:0 0 20px;font-size:18px;color:#1a2b49;font-weight:700;border-bottom:2px solid #f0f3f8;padding-bottom:12px;">
              👤 Applicant Details
            </h2>

            <!-- Name -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr>
                <td width="40%" style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;padding:12px 16px;background:#f8f9fb;border-radius:8px 0 0 8px;vertical-align:top;">
                  Full Name
                </td>
                <td style="font-size:15px;font-weight:600;color:#1a2b49;padding:12px 16px;background:#f0f4fd;border-radius:0 8px 8px 0;vertical-align:top;">
                  ${name}
                </td>
              </tr>
            </table>

            <!-- Email -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr>
                <td width="40%" style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;padding:12px 16px;background:#f8f9fb;border-radius:8px 0 0 8px;vertical-align:top;">
                  Email Address
                </td>
                <td style="padding:12px 16px;background:#f0f4fd;border-radius:0 8px 8px 0;vertical-align:top;">
                  <a href="mailto:${email}" style="font-size:15px;font-weight:600;color:#0066dd;text-decoration:none;">${email}</a>
                </td>
              </tr>
            </table>

            <!-- Phone -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr>
                <td width="40%" style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;padding:12px 16px;background:#f8f9fb;border-radius:8px 0 0 8px;vertical-align:top;">
                  Phone Number
                </td>
                <td style="padding:12px 16px;background:#f0f4fd;border-radius:0 8px 8px 0;vertical-align:top;">
                  <a href="tel:${phone}" style="font-size:15px;font-weight:600;color:#0066dd;text-decoration:none;">${phone}</a>
                </td>
              </tr>
            </table>

            <h2 style="margin:24px 0 20px;font-size:18px;color:#1a2b49;font-weight:700;border-bottom:2px solid #f0f3f8;padding-bottom:12px;">
              🌍 Travel Details
            </h2>

            <!-- Country -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr>
                <td width="40%" style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;padding:12px 16px;background:#f8f9fb;border-radius:8px 0 0 8px;vertical-align:top;">
                  Destination
                </td>
                <td style="font-size:15px;font-weight:700;color:#0d5e99;padding:12px 16px;background:#e8f4ff;border-radius:0 8px 8px 0;vertical-align:top;">
                  🌐 ${country}
                </td>
              </tr>
            </table>

            <!-- Travel Date -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr>
                <td width="40%" style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;padding:12px 16px;background:#f8f9fb;border-radius:8px 0 0 8px;vertical-align:top;">
                  Travel Date
                </td>
                <td style="font-size:15px;font-weight:600;color:#1a2b49;padding:12px 16px;background:#f0f4fd;border-radius:0 8px 8px 0;vertical-align:top;">
                  📅 ${fmtDate(travelDate)}
                </td>
              </tr>
            </table>

            <!-- Travellers -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr>
                <td width="40%" style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;padding:12px 16px;background:#f8f9fb;border-radius:8px 0 0 8px;vertical-align:top;">
                  Travellers
                </td>
                <td style="font-size:15px;font-weight:600;color:#1a2b49;padding:12px 16px;background:#f0f4fd;border-radius:0 8px 8px 0;vertical-align:top;">
                  👥 ${travellers} Adult${travellers > 1 ? "s" : ""}
                </td>
              </tr>
            </table>

            <!-- Message -->
            ${message ? `
            <h2 style="margin:24px 0 16px;font-size:18px;color:#1a2b49;font-weight:700;border-bottom:2px solid #f0f3f8;padding-bottom:12px;">
              💬 Message
            </h2>
            <div style="background:#fafbfd;border:1px solid #e8ecf2;border-left:4px solid #0d5e99;border-radius:0 10px 10px 0;padding:16px 20px;font-size:14px;color:#555;line-height:1.7;">
              ${message}
            </div>
            ` : ""}

          </td>
        </tr>

        <!-- QUICK REPLY BUTTON -->
        <tr>
          <td style="padding:28px 40px 0;text-align:center;">
            <a href="mailto:${email}?subject=Re: ${country} ${enquiryType} Enquiry — Fremor Global&body=Dear ${name},%0A%0AThank you for your enquiry..."
               style="display:inline-block;background:linear-gradient(135deg,#0d496e,#1b6a98);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:30px;font-size:15px;font-weight:700;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(13,73,110,0.35);">
              📧 Reply to ${name}
            </a>
          </td>
        </tr>

        <!-- CALL BUTTON -->
        <tr>
          <td style="padding:12px 40px 0;text-align:center;">
            <a href="tel:${phone}"
               style="display:inline-block;background:#e8f4ff;color:#0d5e99;text-decoration:none;padding:10px 28px;border-radius:24px;font-size:14px;font-weight:600;border:1.5px solid #b8d9f5;">
              📞 Call ${phone}
            </a>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:32px 40px;text-align:center;border-top:1px solid #f0f3f8;margin-top:32px;">
            <p style="margin:0;font-size:12px;color:#aaa;">
              This enquiry was submitted on <strong>${submittedAt}</strong> via the Fremor Global website.
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#bbb;">
              © ${new Date().getFullYear()} Fremor Global · All rights reserved
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
  `.trim();
}

// ── User HTML email template ─────────────────────────────────────────────
function buildUserEmailHTML({ name, country, enquiryType }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You for Your Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#f0f3f8;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
        <tr>
          <td style="background:linear-gradient(135deg,#06294e 0%,#0b4a7a 60%,#0d5e99 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:0.5px;">
              ✈️ Fremor Global
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
              Thank you for reaching out!
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px 32px;">
            <h2 style="margin:0 0 20px;font-size:18px;color:#1a2b49;font-weight:700;">Dear ${name},</h2>
            <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 16px;">
              Thank you for considering Fremor Global for your upcoming travel to <strong>${country}</strong>! We have successfully received your ${enquiryType} enquiry.
            </p>
            <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 16px;">
              Our customer support team is currently reviewing your requirements and will contact you shortly to provide detailed information and assist you further with your travel plans.
            </p>
            <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 24px;">
              If you have any immediate questions, please feel free to reply to this email or contact us directly.
            </p>
            <p style="color:#555;font-size:16px;line-height:1.6;margin:0;font-weight:600;">
              Best regards,<br/>
              The Fremor Global Team
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>

</body>
</html>
  `.trim();
}

// ── POST /api/enquiry ────────────────────────────────────────────────────────
app.post("/api/enquiry", async (req, res) => {
  const { name, email, phone, country, travelDate, travellers, message, enquiryType = "Visa" } = req.body;

  // Basic validation
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, error: "Name, email, and phone are required." });
  }

  const submittedAt = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const htmlBody = buildEmailHTML({ name, email, phone, country, travelDate, travellers, message, submittedAt, enquiryType });
  const userHtmlBody = buildUserEmailHTML({ name, country, enquiryType });

  // 1. Email structure for Company (Receiver)
  const companyMailOptions = {
    from: `"Fremor Global Enquiries" <${process.env.GMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    cc: process.env.TEAM_EMAILS ? process.env.TEAM_EMAILS.split(',') : [], // CC to other company members
    replyTo: email,                        // clicking Reply goes to the applicant
    subject: `✈️ ${enquiryType} Enquiry — ${country} | ${name} | ${phone}`,
    html: htmlBody,
    // Plain text fallback
    text: [
      `NEW ${enquiryType.toUpperCase()} ENQUIRY — Fremor Global`,
      `──────────────────────────────`,
      `Name        : ${name}`,
      `Email       : ${email}`,
      `Phone       : ${phone}`,
      `Destination : ${country}`,
      `Travel Date : ${fmtDate(travelDate)}`,
      `Travellers  : ${travellers} Adult(s)`,
      `Message     : ${message || "None"}`,
      `Submitted   : ${submittedAt}`,
    ].join("\n"),
  };

  // 2. Email structure for End User
  const userMailOptions = {
    from: `"Fremor Global Tours" <${process.env.OFFICIAL_EMAIL || process.env.GMAIL_USER}>`,
    to: email, // Sending to the user's email address
    replyTo: process.env.OFFICIAL_EMAIL || process.env.RECEIVER_EMAIL, // User replies will go here
    subject: `Thank you for your ${enquiryType} enquiry - ${country} | Fremor Global`,
    html: userHtmlBody,
    text: `Dear ${name},\n\nThank you for enquiring about ${country}. We have successfully received your ${enquiryType} enquiry.\n\nOur customer support team is reviewing your requirements and will contact you shortly to provide detailed information.\n\nBest regards,\nFremor Global Team`,
  };

  try {
    // Send both emails concurrently
    await Promise.all([
      transporter.sendMail(companyMailOptions),
      transporter.sendMail(userMailOptions)
    ]);
    
    console.log(`📨  Enquiry emails sent -> Company (${process.env.RECEIVER_EMAIL}) & User (${email}) | Country: ${country}`);
    res.json({ success: true, message: "Enquiry sent successfully." });
  } catch (err) {
    console.error("❌  Failed to send email:", err.message);
    res.status(500).json({ success: false, error: "Failed to send email. Please try again." });
  }
});

// ── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Fremor email server running on http://localhost:${PORT}`);
  console.log(`📧  Sending emails from : ${process.env.GMAIL_USER}`);
  console.log(`📬  Delivering to       : ${process.env.RECEIVER_EMAIL}\n`);
});
