export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type CompletionQuality = "high" | "medium" | "low";

export interface CompletionQualityInfo {
  level: CompletionQuality;
  label: string;
  percentage: number;
}

export interface CompletionStats {
  high: number; // products with completion_percentage > 50
  medium: number; // products with completion_percentage 35-50
  low: number; // products with completion_percentage < 35
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  completionStats?: CompletionStats;
  message?: string;
}

export interface Pricing {
  _id: string;
  plan: string;
  entity: string;
  amount: string;
  currency: string;
  period: string;
  description: string[];
  updated_on: string;
  isPlanFree: boolean;
}

export interface Snapshot {
  _id: string;
  name: string;
  key: string;
  type: string;
  Location: string;
}

export interface Integration {
  _id: string;
  name: string;
  website: string;
  logo: string;
}

export interface MetaKeys {
  description: string;
  title: string;
  h1: string;
  header: string;
}

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface Ratings {
  overall_rating: number;
  ease_of_use: number;
  breadth_of_features: number;
  ease_of_implementation: number;
  value_for_money: number;
  customer_support: number;
  total_reviews: number;
}

export interface AIStatus {
  fed: boolean;
  fed_at: string;
}

export interface Product {
  _id: string;
  completion_percentage: number;
  created_on: string;
  is_active: boolean;
  updated_on: string;
  is_verify: boolean;
  verification_raised_on: string | null;
  verified_on: string | null;
  generated_at?: string | null; // Timestamp when the product was generated
  product_name: string;
  product_slug?: string;
  description?: string;
  short_description?: string; // For minimal API response
  website: string;
  overview: string;
  category: string[];
  company: string;
  company_name?: string; // For minimal API response
  logo_url: string;
  industry: string[];
  parent_category?: string; // For minimal API response
  pricing_details_web_url: string;
  industry_size: string[];
  other_features: string[];
  pricing: Pricing[];
  company_id: string;
  features: string[];
  supports: string[];
  __v: number;
  snapshots: Snapshot[];
  metaKeys: MetaKeys;
  weburl: string;
  integrations: Integration[];
  usp: string;
  support_email: string;
  updated_by: string;
  region: string;
  onHome: boolean;
  parent_categories: string[];
  verification_raised_by: string | null;
  created_by: string;
  updatedAt: string;
  ratings: Ratings;
  onCompare: boolean;
  latest: boolean;
  trending: boolean;
  admin_verified: boolean;
  subscription_plan: string;
  verified_by: string | null;
  sub_cat_banner: boolean;
  comparisons: string[];
  ai_questions: string;
  alt_breadth_of_features: string[];
  alt_customer_support: string[];
  alt_ease_of_implementation: string[];
  alt_ease_of_use: string[];
  alt_value_for_money: string[];
  analyzed_by: Record<string, unknown>; // TODO: Define specific type if known
  badges: string[];
  case_studies: unknown[]; // TODO: Define specific type if known
  company_website: string;
  contact: string;
  country_code: string;
  feature_overview: string;
  gcp_availability: string;
  hq_location: string;
  languages: string[];
  pricing_overview: string;
  social_links: SocialLinks;
  tags: string[];
  tech_stack: unknown[]; // TODO: Define specific type if known
  videos: unknown[]; // TODO: Define specific type if known
  web3_questions: string;
  year_founded: number;
  faq: string;
  updatedBy: string;
  zoftware_analysis: string;
  reviews_strengths: string[];
  reviews_weakness: string[];
  affiliate_link: string | null;
  ai_status: AIStatus;
}

export interface PendingProduct {
  id: string;
  logo: string;
  name: string;
  company: string;
  created_on: string;
  description: string;
  category: string[];
  status: string;
}

export interface ProductData {
  fieldsToReview: Product;
  pendingProducts: PendingProduct[];
}
