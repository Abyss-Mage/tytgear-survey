import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildLeadRow, appendLeadRowToSheets } from "@/lib/google/sheets";
import { sendCouponEmail } from "@/lib/email/sendCoupon";
import { GUARANTEED_DISCOUNT_CODE } from "@/config/survey";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const ClaimRewardSchema = z.object({
  response_id: z.string().min(1, "Response ID is required"),
  email: z.string().email("Please enter a valid email address"),
  contact_consent: z.boolean().refine((val) => val === true, {
    message: "Consent is required to receive the coupon and enter giveaway",
  }),
  affiliation: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = ClaimRewardSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: parseResult.error.errors[0]?.message || "Invalid input data",
        },
        { status: 400 }
      );
    }

    const { response_id, email, contact_consent, affiliation } = parseResult.data;
    const timestamp = new Date().toISOString();

    // 1. Record lead to local leads.json fallback
    try {
      const dataDir = path.join(process.cwd(), ".data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const leadsPath = path.join(dataDir, "leads.json");
      const existingLeads: unknown[] = fs.existsSync(leadsPath)
        ? JSON.parse(fs.readFileSync(leadsPath, "utf-8"))
        : [];

      const leadRecord = {
        response_id,
        timestamp,
        affiliation: affiliation || "",
        email,
        contact_consent,
        claimed_discount: true,
        entered_giveaway: true,
      };

      existingLeads.push(leadRecord);
      fs.writeFileSync(leadsPath, JSON.stringify(existingLeads, null, 2));
    } catch (e) {
      console.warn("Could not write to .data/leads.json:", e);
    }

    // 2. Append to Google Sheets Leads tab if configured
    try {
      const leadRow = [
        response_id,
        timestamp,
        affiliation || "",
        email,
        contact_consent ? "TRUE" : "FALSE",
        "FALSE", // is_creator
        "",      // platform
        "",      // handle
      ];
      await appendLeadRowToSheets(leadRow);
    } catch (e) {
      console.warn("Could not append lead to Google Sheets:", e);
    }

    // 3. Dispatch discount coupon and giveaway entry email
    await sendCouponEmail({
      email,
      responseId: response_id,
      affiliation,
    });

    return NextResponse.json({
      success: true,
      message: `Your email has been recorded. Your 20% launch discount code will be sent to ${email} and your giveaway entry is confirmed!`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in /api/survey/claim-reward:", err);
    return NextResponse.json(
      {
        success: false,
        message: "We encountered an issue saving your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
