import { z } from "zod";

// Contact Information
export const ContactInfoSchema = z.object({
  phone_number: z.string().optional().nullable(),
  country_code: z.string().optional().nullable(),
  support_email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
});

// Social Profile
export const SocialProfileSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
});

// Social Links
export const SocialLinksSchema = z.object({
  linkedin: z.string().url().optional().nullable(),
  twitter: z.string().url().optional().nullable(),
  facebook: z.string().url().optional().nullable(),
});

// GCC Information
export const GCCInfoSchema = z.object({
  offices: z.string().optional().nullable(),
  customers: z.string().optional().nullable(),
  local_address: z.string().optional().nullable(),
  arabic_available: z.boolean().optional().nullable(),
});

// AI Capability Information
export const AICapabilityInfoSchema = z.object({
  ai_usage_summary: z.string().optional().nullable(),
  ai_technologies_used: z.string().optional().nullable(),
});

// Web3 Information
export const Web3InfoSchema = z.object({
  web3_company_status: z.string().optional().nullable(),
  web3_components_list: z.string().optional().nullable(),
});

// Feature
export const FeatureSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
});

// Pricing Plan
export const PricingPlanSchema = z.object({
  plan: z.string(),
  entity: z.string().optional().nullable(),
  amount: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  period: z.string().optional().nullable(),
  description: z.array(z.string()).default([]),
  is_free: z.boolean().optional().nullable(),
});

// Deployment Option
export const DeploymentOptionSchema = z.object({
  type: z.string(),
});

// Support Option
export const SupportOptionSchema = z.object({
  type: z.string(),
});

// Company Information
export const CompanyInfoSchema = z.object({
  overview: z.string().optional().nullable(),
  founding: z.string().optional().nullable(),
  funding_info: z.string().optional().nullable(),
  acquisitions: z.string().optional().nullable(),
  global_presence: z.string().optional().nullable(),
  company_culture: z.string().optional().nullable(),
  community: z.string().optional().nullable(),
  growth_story: z.string().optional().nullable(),
  valuation: z.string().optional().nullable(),
  product_expansion: z.string().optional().nullable(),
  recent_new_features: z.string().optional().nullable(),
  product_offerings: z.array(z.string()).default([]),
});

// Review Summary
export const ReviewSummarySchema = z.object({
  strengths: z.array(z.string()).default([]),
  strengths_paragraph: z.string().optional().nullable(),
  weaknesses: z.array(z.string()).default([]),
  weaknesses_paragraph: z.string().optional().nullable(),
  overall_rating: z.number().optional().nullable(),
  review_sources: z.array(z.string()).default([]),
});

// Implementation FAQ
export const ImplementationFAQSchema = z.object({
  implementation: z.string().optional().nullable(),
  customization: z.string().optional().nullable(),
  training: z.string().optional().nullable(),
  security_measures: z.string().optional().nullable(),
  update: z.string().optional().nullable(),
  data_ownership: z.string().optional().nullable(),
  scaling: z.string().optional().nullable(),
  terms_and_conditions_url: z.string().url().optional().nullable(),
  compliance_standards: z.array(z.string()).default([]),
  additional_costs: z.string().optional().nullable(),
  cancellation_terms: z.string().optional().nullable(),
  contract_renewal_terms: z.string().optional().nullable(),
});

// Integration
export const IntegrationSchema = z.object({
  name: z.string(),
  website: z.string().url().optional().nullable(),
  logo: z.string().url().optional().nullable(),
});

// Pricing Information
export const PricingInfoSchema = z.object({
  overview: z.string().optional().nullable(),
  pricing_url: z.string().url().optional().nullable(),
  pricing_plans: z.array(PricingPlanSchema).default([]),
});

// Product Snapshot (Main Schema)
export const ProductSnapshotSchema = z.object({
  // Basic Product Information
  product_name: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  company_website: z.string().url().optional().nullable(),
  weburl: z.string().regex(/^[a-z-]+$/).optional().nullable(),

  // Product Descriptions
  short_description: z.string().optional().nullable(),
  elevator_pitch: z.string().optional().nullable(),
  competitive_advantage: z.string().optional().nullable(),

  // Company & Founding Information
  year_founded: z.number().int().optional().nullable(),
  hq_location: z.string().optional().nullable(),

  // Categorization
  industry: z.array(z.string()).default([]),
  market_size: z.string().optional().nullable(),
  parent_category: z.string().optional().nullable(),
  sub_category: z.string().optional().nullable(),

  // Contact & Social Information
  contact: ContactInfoSchema.default({}),
  social_profiles: SocialLinksSchema.optional().nullable(),

  // Product Features
  feature_overview: z.string().optional().nullable(),
  features: z.array(FeatureSchema).default([]),
  deployment_options: z.array(DeploymentOptionSchema).default([]),
  support_options: z.array(SupportOptionSchema).default([]),

  // Pricing Information
  pricing: PricingInfoSchema.default({}),
  pricing_overview: z.string().optional().nullable(),

  // FAQ & Implementation Details
  faq: ImplementationFAQSchema.default({}),

  // Company Information
  company_info: CompanyInfoSchema.default({}),

  // Reviews & Ratings
  reviews: ReviewSummarySchema.default({}),

  // Additional Information
  languages_supported: z.array(z.string()).default([]),
  ai_capabilities: z.string().optional().nullable(),
  gcc_availability: z.string().optional().nullable(),
  gcc_info: GCCInfoSchema.optional().nullable(),
  ai_info: AICapabilityInfoSchema.optional().nullable(),
  web3_info: Web3InfoSchema.optional().nullable(),
  web3_components: z.string().optional().nullable(),
  technology_stack: z.array(z.string()).default([]),

  // Media & Visual Information
  logo_url: z.string().url().optional().nullable(),

  // Integration Information
  integrations: z.array(IntegrationSchema).default([]),
});

// Export TypeScript types
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type SocialProfile = z.infer<typeof SocialProfileSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type GCCInfo = z.infer<typeof GCCInfoSchema>;
export type AICapabilityInfo = z.infer<typeof AICapabilityInfoSchema>;
export type Web3Info = z.infer<typeof Web3InfoSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type PricingPlan = z.infer<typeof PricingPlanSchema>;
export type DeploymentOption = z.infer<typeof DeploymentOptionSchema>;
export type SupportOption = z.infer<typeof SupportOptionSchema>;
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;
export type ImplementationFAQ = z.infer<typeof ImplementationFAQSchema>;
export type Integration = z.infer<typeof IntegrationSchema>;
export type PricingInfo = z.infer<typeof PricingInfoSchema>;
export type ProductSnapshot = z.infer<typeof ProductSnapshotSchema>;
