import { NextRequest, NextResponse } from "next/server";
import { SurveySubmissionSchema } from "@/lib/validation/surveySchema";
import {
  evaluateSubmissionSecurity,
  markSubmissionComplete,
} from "@/lib/security/antiSpam";
import { appendSurveyResponse } from "@/lib/google/sheets";
import { GUARANTEED_DISCOUNT_CODE } from "@/config/survey";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Primary: Auto-discover and forward to Go backend service across potential active ports
    const candidateUrls = [
      process.env.GO_BACKEND_URL,
      "http://localhost:8080",
      "http://localhost:8082",
      "http://localhost:8085",
      "http://localhost:8081",
    ].filter(Boolean) as string[];

    for (const baseUrl of candidateUrls) {
      try {
        const goResponse = await fetch(`${baseUrl}/api/survey/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rawBody),
          signal: AbortSignal.timeout(4000), // 4s timeout
        });

        if (goResponse.ok || goResponse.status === 400 || goResponse.status === 500) {
          const goData = await goResponse.json();
          return NextResponse.json(goData, { status: goResponse.status });
        }
      } catch {
        // Try next candidate port
      }
    }

    // 2. Secondary fallback: in-process handler if Go backend is not reachable
    console.warn(
      "[Proxy Notice] Go backend service was not reachable on candidate ports. Engaging secondary in-process handler."
    );

    const parseResult = SurveySubmissionSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required questions with valid answers.",
          errors: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const payload = parseResult.data;

    const securityCheck = evaluateSubmissionSecurity({
      response_id: payload.response_id,
      started_at: payload.started_at,
      honeypot: payload.honeypot,
    });

    if (securityCheck.isDuplicate) {
      return NextResponse.json({
        success: true,
        response_id: payload.response_id,
        message: "Response was already recorded successfully.",
        coupon_code: GUARANTEED_DISCOUNT_CODE,
      });
    }

    const completedAt = new Date().toISOString();
    const sheetsResult = await appendSurveyResponse(payload, {
      completed_at: completedAt,
      completion_seconds: securityCheck.completionSeconds,
      suspicious: securityCheck.isSuspicious,
    });

    if (!sheetsResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "We couldn't submit your response right now. Please try again.",
          error: sheetsResult.error,
        },
        { status: 500 }
      );
    }

    markSubmissionComplete(payload.response_id);

    return NextResponse.json({
      success: true,
      response_id: payload.response_id,
      mode: sheetsResult.mode,
      suspicious: securityCheck.isSuspicious,
      coupon_code: GUARANTEED_DISCOUNT_CODE,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Internal submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "We couldn't submit your response right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
