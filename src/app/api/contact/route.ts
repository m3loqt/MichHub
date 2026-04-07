import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";

const TO_EMAIL = "angelomelcortes06@gmail.com";
const FROM_EMAIL = "MichHub Studios <noreply@michhub.com>";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  // Rate limit: 5 submissions per IP per 10 minutes
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(ip, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  // Basic validation
  if (
    typeof name !== "string" || name.trim().length < 1 ||
    typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" || message.trim().length < 1
  ) {
    return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 422 });
  }

  const safeName = name.trim().slice(0, 120);
  const safeEmail = email.trim().slice(0, 254);
  const safeMessage = message.trim().slice(0, 5000);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: safeEmail,
      subject: `New inquiry from ${safeName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
                  <tr>
                    <td style="padding:36px 40px 28px;">
                      <img src="https://michhub.com/logo-black.svg" alt="MichHub Studios" height="26" style="display:block;height:26px;">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 40px;"><div style="height:1px;background:#f0f0f0;"></div></td>
                  </tr>
                  <tr>
                    <td style="padding:36px 40px 0;">
                      <h1 style="margin:0 0 6px;font-size:26px;font-weight:700;color:#111111;letter-spacing:-0.02em;line-height:1.2;">New Inquiry from ${safeName}</h1>
                      <p style="margin:0 0 32px;font-size:14px;color:#9ca3af;font-weight:400;">${safeEmail}</p>
                      <p style="margin:0;font-size:15px;line-height:1.75;color:#374151;white-space:pre-wrap;">${safeMessage}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 40px 44px;">
                      <a href="mailto:${safeEmail}?subject=Re%3A%20Your%20inquiry" style="display:inline-block;background:#F97316;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;letter-spacing:0.01em;">Send a Reply</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
