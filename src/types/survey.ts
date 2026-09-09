/**
 * TYTGEAR Pre-Launch Market Research Survey Types
 */

export type LikertRating =
  | 'Very Interested'
  | 'Very interested'
  | 'Interested'
  | 'Neutral'
  | 'Not Very Interested'
  | 'Not very interested'
  | 'Not Interested'
  | 'Not interested';

export interface SurveyAnswers {
  // Participant Identity (collected on Welcome step)
  name: string;

  // Section 1: About You
  age: string;
  respondent_type: string;
  city: string;
  state: string;
  affiliation: string; // College / University / Company
  college_id?: string;
  college_name?: string;

  // Section 2: Your Interests & Gaming Habits
  interests: string[];
  gaming_frequency: string;
  platforms: string[];
  setup_type: string;

  // Section 3: What You Own & Buy
  owned_products: string[];
  last_purchase: string;
  recent_purchase: string;
  recent_spend: string;
  purchase_location: string[];
  purchase_drivers: string[]; // Max 3

  // Section 4: Product Interest
  product_interests: Record<string, LikertRating>; // 6 products
  top_products: string[]; // 3 selections

  // Section 5: Design Preferences
  design_purchase_drivers: string[]; // Max 3
  designs_appealing: string[]; // Preferred artwork designs
  design_most_likely_purchase?: string;

  // Section 6: Product Budget Range Sliders
  budget_small_mousepad_min?: number;
  budget_small_mousepad_max?: number;

  budget_large_mousepad_min?: number;
  budget_large_mousepad_max?: number;

  budget_framed_poster_min?: number;
  budget_framed_poster_max?: number;

  budget_metal_poster_min?: number;
  budget_metal_poster_max?: number;

  budget_poster_min?: number;
  budget_poster_max?: number;

  budget_tapestry_min?: number;
  budget_tapestry_max?: number;

  // Legacy price sensitivity fields
  price_small_too_cheap?: number;
  price_small_good_deal?: number;
  price_small_expensive?: number;
  price_small_too_expensive?: number;

  price_large_too_cheap?: number;
  price_large_good_deal?: number;
  price_large_expensive?: number;
  price_large_too_expensive?: number;

  // Section 7: TYTGEAR
  tytgear_interest: string;

  // Section 8: Marketing & Launch
  discovery_channels: string[]; // Max 3
  content_preferences: string[]; // Max 3
  launch_offer: string;
  purchase_intent: number; // 0–10 scale

  // Section 9: Optional Launch Updates & Giveaway Claim (Email ONLY)
  want_updates: 'Yes' | 'No' | '';
  email?: string;
  contact_consent?: boolean;

  // Section 10: Creator / Collab Partnership (Optional)
  is_creator?: boolean;
  creator_platform?: string;
  creator_platforms?: string[];
  creator_handle?: string;
  creator_audience?: string;
  creator_collab_type?: string[];
  creator_email?: string;
  creator_terms_accepted?: boolean;
}

export interface SurveySubmissionPayload extends SurveyAnswers {
  response_id: string;
  survey_version: string;
  started_at: string;
  honeypot?: string;
  college_id?: string;
  college_name?: string;
}

export interface SubmissionResult {
  success: boolean;
  response_id: string;
  message?: string;
  suspicious?: boolean;
  coupon_code?: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url: string;
  active: boolean;
  display_order: number;
}

export interface DesignInfo {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url: string;
  active: boolean;
  display_order: number;
}

export interface CollegeInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  active: boolean;
}
