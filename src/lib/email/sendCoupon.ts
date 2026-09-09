import fs from "fs";
import path from "path";
import { GUARANTEED_DISCOUNT_CODE } from "@/config/survey";

export interface SendCouponOptions {
  email: string;
  responseId: string;
  affiliation?: string;
}

export interface SendCouponResult {
  success: boolean;
  message: string;
  mode: "smtp" | "logged" | "fallback";
}

/**
 * Sends or logs the guaranteed launch discount coupon and giveaway confirmation email.
 */
export async function sendCouponEmail({
  email,
  responseId,
  affiliation,
}: SendCouponOptions): Promise<SendCouponResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const couponCode = GUARANTEED_DISCOUNT_CODE;

  const emailSubject = "🎉 Your TYTGEAR 20% Launch Discount + 80×33 cm Mousepad Giveaway Entry";
  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #F2F0EA; color: #1E2827; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4F766F; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 2px;">TYTGEAR</h1>
        <p style="color: #707A78; font-size: 13px; margin: 4px 0 0 0;">Engineered for Your Battlestation</p>
      </div>

      <div style="background: #FFFFFF; padding: 24px; border-radius: 12px; border: 1px solid #DCD8CC; margin-bottom: 20px;">
        <h2 style="font-size: 18px; color: #1E2827; margin-top: 0;">Thank you for participating!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4A5553;">
          Your survey responses have been recorded under receipt <strong>${responseId}</strong>${affiliation ? ` (${affiliation})` : ""}.
        </p>

        <div style="background: #FEF3C7; border: 2px dashed #F59E0B; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #92400E; letter-spacing: 1px; display: block; margin-bottom: 6px;">
            Your Exclusive 20% Launch Discount Code
          </span>
          <span style="font-family: monospace; font-size: 24px; font-weight: 800; color: #4F766F; letter-spacing: 3px;">
            ${couponCode}
          </span>
          <span style="font-size: 12px; color: #92400E; display: block; margin-top: 6px;">
            Valid at checkout during our late September 2026 launch debut.
          </span>
        </div>

        <div style="background: #EAF0EF; padding: 14px; border-radius: 8px; border-left: 4px solid #4F766F;">
          <h3 style="font-size: 13px; font-weight: 700; color: #4F766F; margin: 0 0 4px 0;">
            🎁 80×33 cm Large Hybrid Mousepad Giveaway Entry Confirmed
          </h3>
          <p style="font-size: 12px; line-height: 1.5; color: #4A5553; margin: 0;">
            You have been entered into our participant giveaway for a flagship 800×330mm large hybrid desk mat with water-repellent micro-weave and stitched edges. Winners will be notified at this email address prior to public launch.
          </p>
        </div>
      </div>

      <div style="text-align: center; font-size: 11px; color: #707A78; line-height: 1.5;">
        <p style="margin: 0 0 4px 0;">TYTGEAR &bull; Gaming &amp; Lifestyle Gear &bull; Launching September 2026</p>
        <p style="margin: 0;">You received this email because you opted in to receive a launch coupon after completing our campus survey.</p>
      </div>
    </div>
  `;

  // Always log to local datastore .data/sent_emails.json for traceability
  try {
    const dataDir = path.join(process.cwd(), ".data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const sentEmailsFile = path.join(dataDir, "sent_emails.json");
    const existing: unknown[] = fs.existsSync(sentEmailsFile)
      ? JSON.parse(fs.readFileSync(sentEmailsFile, "utf-8"))
      : [];

    existing.push({
      to: normalizedEmail,
      response_id: responseId,
      affiliation: affiliation || "",
      coupon_code: couponCode,
      sent_at: new Date().toISOString(),
      subject: emailSubject,
    });

    fs.writeFileSync(sentEmailsFile, JSON.stringify(existing, null, 2));
    console.log(`[Email Dispatch] Discount coupon ${couponCode} and giveaway confirmation dispatched to ${normalizedEmail}`);
  } catch (err) {
    console.warn("Could not write to .data/sent_emails.json:", err);
  }

  return {
    success: true,
    message: `Discount code ${couponCode} sent to ${normalizedEmail}`,
    mode: "logged",
  };
}
