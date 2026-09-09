package config

import (
	"bufio"
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	Port                         string
	GoogleServiceAccountEmail    string
	GooglePrivateKey             string
	GoogleSheetID                string
	AllowLocalSubmissionFallback bool
}

// Load reads environment variables and attempts to parse .env.local if present
func Load() *Config {
	loadEnvFile(".env.local")
	loadEnvFile("../.env.local")
	loadEnvFile(".env")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	cfg := &Config{
		Port:                         port,
		GoogleServiceAccountEmail:    os.Getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
		GooglePrivateKey:             os.Getenv("GOOGLE_PRIVATE_KEY"),
		GoogleSheetID:                os.Getenv("GOOGLE_SHEET_ID"),
		AllowLocalSubmissionFallback: os.Getenv("ALLOW_LOCAL_SUBMISSION_FALLBACK") == "true" || os.Getenv("NODE_ENV") != "production",
	}

	return cfg
}

func loadEnvFile(relPath string) {
	absPath, err := filepath.Abs(relPath)
	if err != nil {
		return
	}

	file, err := os.Open(absPath)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			val := strings.TrimSpace(parts[1])

			// Strip quotes
			if (strings.HasPrefix(val, `"`) && strings.HasSuffix(val, `"`)) ||
				(strings.HasPrefix(val, `'`) && strings.HasSuffix(val, `'`)) {
				val = val[1 : len(val)-1]
			}

			// Only set if not already present in environment
			if os.Getenv(key) == "" {
				os.Setenv(key, val)
			}
		}
	}
}
