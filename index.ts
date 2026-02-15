// Type definitions for the AI App Builder platform

/**
 * Project status enum
 */
export type ProjectStatus = 'generating' | 'ready' | 'deployed' | 'failed' | 'deleted';

/**
 * Subscription tier enum
 */
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

/**
 * Project database model
 */
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string; // Original user prompt
  code: GeneratedCode;
  preview_url: string | null;
  deploy_url: string | null;
  status: ProjectStatus;
  ai_model: string;
  generation_time: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Generated code structure
 */
export interface GeneratedCode {
  files: CodeFile[];
  dependencies?: Record<string, string>;
  framework?: string;
}

/**
 * Individual code file
 */
export interface CodeFile {
  path: string;
  content: string;
  language: string;
}

/**
 * User profile model
 */
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  projects_count: number;
  total_generations: number;
  subscription_tier: SubscriptionTier;
  subscription_status: string;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * AI generation request
 */
export interface GenerateRequest {
  prompt: string;
  name?: string;
  framework?: 'react' | 'vue' | 'vanilla';
}

/**
 * AI generation response
 */
export interface GenerateResponse {
  success: boolean;
  project?: Project;
  error?: string;
}

/**
 * Deployment request
 */
export interface DeployRequest {
  project_id: string;
}

/**
 * Deployment response
 */
export interface DeployResponse {
  success: boolean;
  deploy_url?: string;
  error?: string;
}

/**
 * API error response
 */
export interface APIError {
  error: string;
  message: string;
  status: number;
}

/**
 * Deployment log model
 */
export interface DeploymentLog {
  id: string;
  project_id: string;
  user_id: string;
  status: 'pending' | 'success' | 'failed';
  deploy_url: string | null;
  error_message: string | null;
  deployment_provider: string;
  build_time: number | null;
  created_at: string;
}

/**
 * Analytics event model
 */
export interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  project_id: string | null;
  event_type: string;
  event_data: Record<string, any>;
  created_at: string;
}
