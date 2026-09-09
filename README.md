# TYTGEAR Pre-Launch Market Research Survey

Production-ready, mobile-first market research survey application for **TYTGEAR**—an upcoming Indian gaming and lifestyle gear brand scheduled to launch in late 2026.

Built with **Next.js 15 (App Router) + TypeScript + React + Tailwind CSS + Go (Golang) Backend + Google Sheets API** and optimized for direct deployment on **Vercel**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Brand Identity & Real Assets](#3-brand-identity--real-assets)
4. [Architecture: Next.js Frontend + Go Backend](#4-architecture-nextjs-frontend--go-backend)
5. [Project Structure](#5-project-structure)
6. [Local Setup & Quickstart](#6-local-setup--quickstart)
7. [Environment Variables](#7-environment-variables)
8. [Google Cloud & Google Sheets Setup](#8-google-cloud--google-sheets-setup)
9. [Vercel Deployment](#9-vercel-deployment)
10. [College Tracking & URL Parameters](#10-college-tracking--url-parameters)
11. [Data Security, Anti-Spam & Privacy](#11-data-security-anti-spam--privacy)
12. [Google Sheets Schema Reference](#12-google-sheets-schema-reference)
13. [Testing Checklist & Troubleshooting](#13-testing-checklist--troubleshooting)

---

## 1. Project Overview

This application serves as a serious pre-launch market research instrument distributed across college campuses in India. It captures:
- Target customer demographics and student profiles
- Setup categories and peripheral ownership
- Actual purchasing behavior and spend levels
- Genuine product category demand across 10 items
- Key attribute importance vs. market dissatisfaction
- Blind aesthetic evaluations across 8 neutral design concepts
- Simplified **Van Westendorp** price-sensitivity (Too Cheap, Good Deal, Expensive, Too Expensive)
- TYTGEAR brand receptivity and trial drivers
- High-priority marketing channels and launch offer preferences
- 0–10 purchase likelihood rating

**Key Research Design Principles:**
- Non-promotional, objective tone
- No leading questions or assumptions that respondents are hardcore gamers
- 12 sequential, mobile-optimized steps with backward navigation and answer persistence
- Unique non-sequential Response ID (`TYT-2026-XXXXXXXX`)
- Strict separation of optional contact info (`Leads` tab) from anonymous responses (`Responses` tab)

---

## 2. Tech Stack

- **Frontend**: Next.js 15 (App Router, Server Components & Route Handlers), React 19, Tailwind CSS, Lucide React icons
- **Backend Service**: Go 1.22+ (`net/http`, `sync.Map` in-memory idempotency, strict validation engine)
- **Validation**: Strict schema validation in both Go and TypeScript (Zod)
- **Datastore**: Google Sheets API v4 (via official `google.golang.org/api/sheets/v4` and Node.js fallback)
- **Deployment**: Vercel (Frontend & Edge Proxy) + Go Microservice / Standalone Binary

---

## 3. Brand Identity & Real Assets

The project incorporates genuine TYTGEAR brand identity assets:
- **Official Brand Logos**: High-resolution wordmark (`tytgear-logo.png`) and emblem (`tytgear-icon.png`).
- **Brand Aesthetic**: Minimalist, tactile palette featuring `#F2F0EA` (warm canvas background) and `#4F766F` (sage/forest green brand tone).
- **Real Product Mockups**:
  - Small Gaming Mousepad (`small-mousepad.webp`) featured in Step 8 for Van Westendorp pricing.
  - Setup Photography (`tytgear-showcase.webp`) featured in Step 9 for the brand concept showcase.
  - Real artwork designs A through H (`design-a.webp` through `design-h.webp`) for blind evaluation cards with strictly neutral labels.

---

## 4. Architecture: Next.js Frontend + Go Backend

```
                               ┌────────────────────────┐
                               │  Browser / Smartphone  │
                               └───────────┬────────────┘
                                           │
                        ┌──────────────────▼──────────────────┐
                        │   Next.js 15 App Router (:3000)     │
                        │   - Responsive 12-Step Survey UX    │
                        │   - Client-side Session Persistence │
                        │   - Edge Proxy & Route Fallback     │
                        └──────────────────┬──────────────────┘
                                           │ POST /api/survey/submit
                        ┌──────────────────▼──────────────────┐
                        │       Go Backend Service (:8080)    │
                        │   - Van Westendorp Price Engine     │
                        │   - Multi-Select Limit Enforcer     │
                        │   - Anti-Spam & Duration Heuristics │
                        │   - Thread-Safe Idempotency Cache   │
                        └──────────────────┬──────────────────┘
                                           │
                        ┌──────────────────▼──────────────────┐
                        │       Google Sheets API (v4)        │
                        │   - Responses Tab (50 Columns)      │
                        │   - Leads Tab (6 Columns)           │
                        │   - Colleges / Designs / Products   │
                        └─────────────────────────────────────┘
```

---

## 5. Project Structure

```
proud-fermi/
├── server/                           # High-Performance Go Backend Service
│   ├── go.mod                        # Go module definition (go 1.22+)
│   ├── go.sum                        # Checksums for Google APIs & OAuth2
│   ├── main.go                       # HTTP server, routing, CORS, graceful shutdown
│   ├── config/config.go              # Config & .env.local loader
│   ├── models/survey.go              # Payload, response structs & row builders
│   ├── validator/validator.go        # Go validation engine
│   ├── validator/validator_test.go   # Go automated test suite
│   ├── antispam/antispam.go          # Honeypot, duration check, idempotency cache
│   └── sheets/sheets.go              # Google Sheets API client & local fallback
├── public/
│   └── images/
│       ├── brand/                    # Real TYTGEAR logos & setup photography
│       ├── designs/                  # Real mockups for Design A through H
│       └── products/                 # Real small mousepad & category graphics
├── scripts/
│   ├── copy-brand-assets.js          # Copies brand assets from project folder
│   ├── setup-sheet-headers.js        # One-click Google Sheet tabs & headers setup
│   ├── test-submit.js                # Validation & security schema tests
│   ├── test-go-backend.js            # Go backend live HTTP integration test suite
│   └── test-e2e-http.js              # Full-stack end-to-end integration test runner
└── src/
    ├── app/                          # Next.js App Router routes (/survey, /api, /thank-you)
    ├── components/                   # Reusable UI cards, inputs, and survey steps
    ├── config/                       # Design, product, and college configurations
    ├── lib/                          # Client-side validation, security, and ID generator
    └── types/                        # TypeScript models
```

---

## 6. Local Setup & Quickstart

### Prerequisites
- Node.js 18+ and npm 9+
- Go 1.22+

### 1. Install Node Dependencies & Build Go Backend
```bash
npm install
npm run server:build
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(When Google Cloud keys are not yet configured, the system gracefully writes submissions to `.data/submissions.json` so you can test all 12 steps locally without error.)*

### 3. Run Test Suites
```bash
# Test Go backend validation rules
npm run server:test

# Test TypeScript schema validation
npm run test:submit
```

### 4. Start Services
In one terminal, start the Go backend:
```bash
npm run server:start
```
In another terminal, start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/survey?college=IITD01](http://localhost:3000/survey?college=IITD01).

---

## 7. Environment Variables

Configure these in `.env.local` or in your hosting provider's project settings:

| Variable | Description | Required | Example |
|---|---|---|---|
| `PORT` | Go server listening port | Optional | `8080` or `8085` |
| `GO_BACKEND_URL` | URL of the Go backend service | Optional | `http://localhost:8080` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email from Google Cloud | Prod only | `tytgear-sa@tytgear-study.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Private key with `\n` linebreaks | Prod only | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` |
| `GOOGLE_SHEET_ID` | Spreadsheet ID from the Google Sheet URL | Prod only | `1A2B3C4D5E6F7G8H9I0J_sheet_id` |
| `ALLOW_LOCAL_SUBMISSION_FALLBACK` | Allow writing to `.data/` when keys are missing | Dev only | `"true"` |

---

## 8. Google Cloud & Google Sheets Setup

1. **Create Google Cloud Project**: Open [Google Cloud Console](https://console.cloud.google.com/) $\rightarrow$ Create project `tytgear-market-research`.
2. **Enable Google Sheets API**: Navigate to **APIs & Services > Library**, search for **Google Sheets API**, and click **Enable**.
3. **Create Service Account**:
   - Go to **APIs & Services > Credentials > Create Credentials > Service Account**.
   - Name: `tytgear-sheets-writer`, Role: **Editor**.
   - Create and download a **JSON Key**.
4. **Create Google Sheet**:
   - Create a new Google Sheet named `TYTGEAR Pre-Launch Research 2026`.
   - Click **Share** $\rightarrow$ Add your service account email as **Editor**.
5. **Run Initialization Script**:
   ```bash
   node scripts/setup-sheet-headers.js
   ```
   This automatically formats all 6 tabs: `Responses`, `Leads`, `Colleges`, `Designs`, `Products`, and `Survey Metadata`.

---

## 9. Vercel Deployment

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com/), click **Add New > Project** and select your repository.
3. In **Environment Variables**, add `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID`.
4. (Optional) If running the Go backend as an external microservice (e.g. on Fly.io, Railway, or Render), set `GO_BACKEND_URL` to point to it.
5. Click **Deploy**.

---

## 10. College Tracking & URL Parameters

Distribute college-specific survey links to campus ambassadors:
```
https://survey.tytgear.com/survey?college=ABC123
https://survey.tytgear.com/survey?college=IITD01
https://survey.tytgear.com/survey?college=BITS01
```
If an unlisted or invalid code is passed, the survey gracefully falls back to `"Other / Not specified"`, allowing manual institution selection.

---

## 11. Data Security, Anti-Spam & Privacy

1. **Zero Client-Side Credentials**: Google Service Account private keys are accessed solely on the server.
2. **Hidden Honeypot Field**: An off-screen bot trap catches automated web scrapers and flags `suspicious_response = TRUE`.
3. **Completion Speed Heuristics**: Submissions completed under 40 seconds (unrealistic for 33 questions) are flagged `suspicious_response = TRUE`.
4. **Thread-Safe Idempotency Cache**: Submissions are cached in-memory by `response_id`. Rapid retries do not create duplicate rows.
5. **Privacy by Design**: Voluntary contact information (Step 11) is stored separately in the `Leads` tab. The main `Responses` dataset remains anonymous.

---

## 12. Google Sheets Schema Reference

### `Responses` Tab (Columns 1–50)
| Column | Name | Description |
|---|---|---|
| 1 | `response_id` | Unique ID (`TYT-2026-XXXXXXXX`) |
| 2 | `survey_version` | Active version (e.g. `1.0`) |
| 3 | `timestamp_started` | ISO timestamp when survey opened |
| 4 | `timestamp_completed` | ISO timestamp when survey submitted |
| 5 | `completion_time_seconds` | Elapsed duration in seconds |
| 6 | `college_id` | Campus code (e.g. `IITD01`) |
| 7 | `college_name` | Campus title |
| 8 | `age` | Q1 Age bracket |
| 9 | `respondent_type` | Q2 Role / occupation |
| 10 | `city` | Q3 City |
| 11 | `state` | Q4 State / UT |
| 12 | `interests` | Q6 Pipe-delimited interests |
| 13 | `gaming_frequency` | Q7 Frequency of play |
| 14 | `platforms` | Q8 Platforms regularly used |
| 15 | `setup_type` | Q9 Desk setup description |
| 16 | `owned_products` | Q10 Currently owned gear |
| 17 | `last_purchase` | Q11 Time of last purchase |
| 18 | `recent_purchase` | Q12 Most recently purchased item |
| 19 | `recent_spend` | Q13 Amount spent |
| 20 | `purchase_location` | Q14 Where purchased |
| 21 | `purchase_drivers` | Q15 Top purchase influences (max 3) |
| 22–31 | `product_interest_*` | Q16 5-point interest per product |
| 32 | `top_products` | Q17 Top 3 products prioritized |
| 33 | `important_attributes` | Q18 Key attributes (max 5) |
| 34 | `purchase_problems` | Q19 Market pain points |
| 35 | `designs_appealing` | Q20 Appealing designs (max 3) |
| 36 | `design_most_likely_purchase` | Q21 Most likely to purchase (single) |
| 37 | `design_most_likely_display` | Q22 Most likely to display (single) |
| 38 | `design_purchase_drivers` | Q23 Design purchase drivers (max 3) |
| 39 | `price_too_cheap` | Q24 Van Westendorp Too Cheap (₹) |
| 40 | `price_good_deal` | Q25 Van Westendorp Good Deal (₹) |
| 41 | `price_expensive` | Q26 Van Westendorp Expensive (₹) |
| 42 | `price_too_expensive` | Q27 Van Westendorp Too Expensive (₹) |
| 43 | `tytgear_interest` | Q28 TYTGEAR brand interest |
| 44 | `tytgear_trial_drivers` | Q29 Reasons to try TYTGEAR (max 3) |
| 45 | `discovery_channels` | Q30 Discovery channels (max 3) |
| 46 | `content_preferences` | Q31 Content preferences (max 3) |
| 47 | `launch_offer` | Q32 Preferred launch offer |
| 48 | `purchase_intent` | Q33 Purchase intent (0–10) |
| 49 | `contact_consent` | Opted into launch updates (`TRUE`/`FALSE`) |
| 50 | `suspicious_response` | Flagged by anti-spam (`TRUE`/`FALSE`) |

### `Leads` Tab
| Column | Name | Description |
|---|---|---|
| 1 | `response_id` | Matching survey response ID |
| 2 | `timestamp` | Submission timestamp |
| 3 | `college` | College affiliation |
| 4 | `contact_method` | `Email`, `Instagram`, or `WhatsApp` |
| 5 | `contact_value` | Email, handle, or phone number |
| 6 | `consent` | Explicit consent (`TRUE`) |

---

## 13. Testing Checklist & Troubleshooting

- [x] **Go Backend Unit Tests**: `npm run server:test` passes all validation and price hierarchy checks.
- [x] **Next.js Production Build**: `npm run build` compiles with zero errors or warnings.
- [x] **Live Integration Tests**: `npm run test:go` confirms health probe, college listing, idempotency, and anti-spam detection on live Go server.
- [x] **Real Asset Verification**: Genuine TYTGEAR logos, mousepad mockups, and setup photos load seamlessly on all viewports.
