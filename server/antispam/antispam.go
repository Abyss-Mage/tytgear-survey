package antispam

import (
	"strings"
	"sync"
	"time"
)

type submissionRecord struct {
	Timestamp time.Time
}

var (
	submissionCache sync.Map
)

func init() {
	// Periodic cleanup of expired cache entries (24h TTL)
	go func() {
		ticker := time.NewTicker(1 * time.Hour)
		for range ticker.C {
			cutoff := time.Now().Add(-24 * time.Hour)
			submissionCache.Range(func(key, value interface{}) bool {
				if rec, ok := value.(submissionRecord); ok {
					if rec.Timestamp.Before(cutoff) {
						submissionCache.Delete(key)
					}
				}
				return true
			})
		}
	}()
}

// SecurityResult encapsulates evaluation outcome
type SecurityResult struct {
	IsDuplicate       bool
	IsSuspicious      bool
	CompletionSeconds int
	Reasons           []string
}

// Evaluate evaluates submission integrity, honeypot, and timing heuristics
func Evaluate(responseID, startedAt, honeypot string) SecurityResult {
	var reasons []string
	isSuspicious := false

	// 1. Idempotency duplicate check
	_, isDuplicate := submissionCache.Load(responseID)

	// 2. Honeypot check
	if strings.TrimSpace(honeypot) != "" {
		isSuspicious = true
		reasons = append(reasons, "Honeypot field filled by automated bot")
	}

	// 3. Completion time heuristic
	completionSeconds := 60 // Default fallback
	if startedTime, err := time.Parse(time.RFC3339, startedAt); err == nil {
		diff := time.Since(startedTime).Seconds()
		if diff < 1 {
			diff = 1
		}
		completionSeconds = int(diff)
	}

	// 33 questions completed in under 40 seconds indicates bot or careless clicking
	if completionSeconds < 40 {
		isSuspicious = true
		reasons = append(reasons, "Completion time unrealistically fast (< 40s)")
	}

	return SecurityResult{
		IsDuplicate:       isDuplicate,
		IsSuspicious:      isSuspicious,
		CompletionSeconds: completionSeconds,
		Reasons:           reasons,
	}
}

// MarkComplete records responseID in the thread-safe cache
func MarkComplete(responseID string) {
	submissionCache.Store(responseID, submissionRecord{
		Timestamp: time.Now(),
	})
}
