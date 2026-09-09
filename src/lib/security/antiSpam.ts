/**
 * Anti-Spam and Submission Integrity checks
 */

// In-memory idempotency cache (keyed by response_id) with 24-hour expiration
const completedSubmissions = new Map<string, { timestamp: number; success: boolean }>();

// Clean cache periodically to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    for (const [id, data] of completedSubmissions.entries()) {
      if (data.timestamp < cutoff) {
        completedSubmissions.delete(id);
      }
    }
  }, 60 * 60 * 1000);
}

export interface AntiSpamResult {
  isDuplicate: boolean;
  isSuspicious: boolean;
  reasons: string[];
  completionSeconds: number;
}

export function evaluateSubmissionSecurity(payload: {
  response_id: string;
  started_at: string;
  honeypot?: string;
}): AntiSpamResult {
  const reasons: string[] = [];
  let isSuspicious = false;

  // 1. Check idempotency (Duplicate check)
  const isDuplicate = completedSubmissions.has(payload.response_id);

  // 2. Honeypot check
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    isSuspicious = true;
    reasons.push("Honeypot field was filled by automated bot");
  }

  // 3. Completion time calculation and heuristic
  const startedTime = new Date(payload.started_at).getTime();
  const currentTime = Date.now();
  const completionSeconds = Math.max(
    1,
    Math.round((currentTime - (isNaN(startedTime) ? currentTime : startedTime)) / 1000)
  );

  // A 33-question survey completed in under 40 seconds indicates rapid bot or random clicking
  if (completionSeconds < 40) {
    isSuspicious = true;
    reasons.push(`Completion time unrealistically fast (${completionSeconds}s < 40s)`);
  }

  return {
    isDuplicate,
    isSuspicious,
    reasons,
    completionSeconds,
  };
}

export function markSubmissionComplete(response_id: string): void {
  completedSubmissions.set(response_id, {
    timestamp: Date.now(),
    success: true,
  });
}
