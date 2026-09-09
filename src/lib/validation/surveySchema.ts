import { z } from "zod";

// Price Sliders Range Schema
export const PriceSensitivityRangeSchema = z
  .object({
    too_cheap: z.number().positive(),
    good_deal: z.number().positive(),
    expensive: z.number().positive(),
    too_expensive: z.number().positive(),
  })
  .refine((d) => d.too_cheap <= d.good_deal, {
    message: "Good deal price must be greater than or equal to too-cheap price",
    path: ["good_deal"],
  })
  .refine((d) => d.good_deal <= d.expensive, {
    message: "Expensive price must be greater than or equal to good deal price",
    path: ["expensive"],
  })
  .refine((d) => d.expensive <= d.too_expensive, {
    message: "Too expensive price must be greater than or equal to expensive price",
    path: ["too_expensive"],
  });

// Full Survey Submission Schema (v2.0)
export const SurveySubmissionSchema = z
  .object({
    response_id: z.string().regex(/^TYT-2026-[A-Z0-9]{8}$/, "Invalid response ID format"),
    survey_version: z.string().default("2.0"),
    started_at: z.string().min(1, "Started timestamp is required"),
    honeypot: z.string().optional(),
    college_id: z.string().optional(),
    college_name: z.string().optional(),

    // Participant Identity
    name: z.string().trim().min(1, "Name is required"),

    // Section 1: About You
    age: z.string().min(1, "Age is required"),
    respondent_type: z.string().min(1, "Respondent role is required"),
    city: z.string().trim().min(1, "City is required"),
    state: z.string().trim().min(1, "State is required"),
    affiliation: z.string().trim().min(1, "College, university, or company is required"),

    // Section 2: Interests & Gaming Habits
    interests: z.array(z.string()).min(1, "Please select at least one interest"),
    gaming_frequency: z.string().min(1, "Please select your gaming frequency"),
    platforms: z.array(z.string()).min(1, "Please select at least one platform"),
    setup_type: z.string().min(1, "Please describe your current setup"),

    // Section 3: What You Own & Buy
    owned_products: z.array(z.string()).min(1, "Please select products you currently own"),
    last_purchase: z.string().min(1, "Please select when you last made a purchase"),
    recent_purchase: z.string().min(1, "Please select what you purchased most recently"),
    recent_spend: z.string().min(1, "Please select approximately how much you spent"),
    purchase_location: z.array(z.string()).min(1, "Please select where you made your purchase"),
    purchase_drivers: z
      .array(z.string())
      .min(1, "Please select at least 1 factor that influenced your purchase")
      .max(3, "Please select no more than 3 factors"),

    // Section 4: Product Interest
    product_interests: z.record(z.string(), z.string()).refine(
      (val) => Object.keys(val).length >= 6,
      { message: "Please rate your interest in all products" }
    ),
    top_products: z
      .array(z.string())
      .min(1, "Please choose at least 1 product you'd prioritize")
      .max(3, "Please select up to 3 products only"),

    // Section 5: Design Preferences
    design_purchase_drivers: z
      .array(z.string())
      .min(1, "Please select what makes a design worth purchasing")
      .max(3, "Please select up to 3 reasons"),
    designs_appealing: z.array(z.string()).optional(),
    design_most_likely_purchase: z.string().optional(),

    // Section 6: Budget Ranges & Pricing Sliders
    budget_small_mousepad_min: z.number().positive().optional(),
    budget_small_mousepad_max: z.number().positive().optional(),
    budget_large_mousepad_min: z.number().positive().optional(),
    budget_large_mousepad_max: z.number().positive().optional(),
    budget_framed_poster_min: z.number().positive().optional(),
    budget_framed_poster_max: z.number().positive().optional(),
    budget_metal_poster_min: z.number().positive().optional(),
    budget_metal_poster_max: z.number().positive().optional(),
    budget_poster_min: z.number().positive().optional(),
    budget_poster_max: z.number().positive().optional(),
    budget_tapestry_min: z.number().positive().optional(),
    budget_tapestry_max: z.number().positive().optional(),

    price_small_too_cheap: z.number().positive().optional(),
    price_small_good_deal: z.number().positive().optional(),
    price_small_expensive: z.number().positive().optional(),
    price_small_too_expensive: z.number().positive().optional(),

    price_large_too_cheap: z.number().positive().optional(),
    price_large_good_deal: z.number().positive().optional(),
    price_large_expensive: z.number().positive().optional(),
    price_large_too_expensive: z.number().positive().optional(),

    // Section 7: TYTGEAR
    tytgear_interest: z.string().min(1, "Please rate your interest in TYTGEAR"),

    // Section 8: Marketing & Launch
    discovery_channels: z
      .array(z.string())
      .min(1, "Please select at least 1 channel")
      .max(3, "Please select up to 3 channels"),
    content_preferences: z
      .array(z.string())
      .min(1, "Please select at least 1 content type")
      .max(3, "Please select up to 3 content types"),
    launch_offer: z.string().min(1, "Please select a launch offer"),
    purchase_intent: z.number().min(0).max(10),

    // Section 9: Giveaway & Discount Claim (Email only, optional on main survey submit)
    want_updates: z.enum(["Yes", "No", ""]).optional(),
    email: z.string().optional(),
    contact_consent: z.boolean().optional(),

    // Section 10: Creator Application (Optional)
    is_creator: z.boolean().optional(),
    creator_platform: z.string().optional(),
    creator_handle: z.string().optional(),
    creator_audience: z.string().optional(),
    creator_collab_type: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.email && data.email.trim().length > 0) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
      }
      return true;
    },
    {
      message: "Please enter a valid email address",
      path: ["email"],
    }
  );

export type SurveySubmissionInput = z.infer<typeof SurveySubmissionSchema>;
