const { Resend } = require('resend');

// Initialize Resend safely with API key
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Email Service] RESEND_API_KEY is not set. Email will not be sent.');
    return null;
  }
  return new Resend(apiKey);
};

/**
 * Send an email notification to the Admin when a new contact message is received.
 * @param {Object} data { name, email, projectType, message }
 */
async function sendContactNotification({ name, email, projectType, message }) {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, reason: 'RESEND_API_KEY_MISSING' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'editor.manish18@gmail.com';
  // Resend free tier sends from onboarding@resend.dev unless a custom domain is verified
  const fromEmail = process.env.RESEND_FROM || 'Manish Portfolio <onboarding@resend.dev>';
  const sanitizedProjectType = projectType || 'General Inquiry';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Inquiry</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
        .container { max-width: 580px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 28px 24px; border-bottom: 2px solid #eab308; text-align: center; }
        .header h1 { margin: 0; color: #f8fafc; font-size: 20px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
        .header p { margin: 6px 0 0 0; color: #eab308; font-size: 13px; font-weight: 500; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 18px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .info-table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #1e293b; }
        .info-label { color: #94a3b8; font-weight: 600; width: 30%; }
        .info-val { color: #f1f5f9; }
        .message-box { background: #0b0f19; border: 1px solid #1e293b; border-left: 3px solid #eab308; border-radius: 8px; padding: 16px; margin: 16px 0 24px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
        .btn-container { text-align: center; margin: 28px 0 12px 0; }
        .reply-btn { display: inline-block; background: #eab308; color: #0b0f19 !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 6px; letter-spacing: 0.03em; }
        .footer { padding: 18px 24px; background: #0a0e17; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Manish &mdash; Portfolio</h1>
          <p>&bull; New Contact Submission Received &bull;</p>
        </div>
        <div class="content">
          <span class="badge">New Client Lead</span>
          
          <table class="info-table">
            <tr>
              <td class="info-label">Name:</td>
              <td class="info-val"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td class="info-label">Email:</td>
              <td class="info-val"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td class="info-label">Project Type:</td>
              <td class="info-val">${sanitizedProjectType}</td>
            </tr>
            <tr>
              <td class="info-label">Received At:</td>
              <td class="info-val">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>

          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 6px;">
            Message Content:
          </div>
          <div class="message-box">${message}</div>

          <div class="btn-container">
            <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(sanitizedProjectType)}%20Inquiry%20-%20Manish" class="reply-btn">
              &rarr; Click to Reply to ${name}
            </a>
          </div>
        </div>
        <div class="footer">
          This email was sent automatically from your video editor portfolio contact form via Resend.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      reply_to: email, // Direct reply to client
      subject: `🎥 [New Portfolio Inquiry] from ${name} (${sanitizedProjectType})`,
      html: htmlContent,
      text: `New contact submission from ${name} (${email})\nProject Type: ${sanitizedProjectType}\n\nMessage:\n${message}`,
    });

    if (response.error) {
      console.error('[Resend Error]', response.error);
      return { success: false, error: response.error };
    }

    console.log(`[Email Service] Contact notification sent successfully to ${adminEmail} (id: ${response.data?.id})`);
    return { success: true, id: response.data?.id };
  } catch (err) {
    console.error('[Email Service Exception]', err);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendContactNotification,
};
