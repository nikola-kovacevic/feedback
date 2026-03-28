export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  createdAt: string;
  updatedAt: string;
}

export interface WidgetConfig {
  mode: 'floating' | 'inline';
  question: string;
  commentRequired: boolean;
  themeColor: string;
  cooldownHours: number;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export interface Application {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  previousApiKey: string | null;
  previousApiKeyExpiresAt: string | null;
  widgetConfig: WidgetConfig;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  embedSnippet?: string;
}

export interface FeedbackResponse {
  id: string;
  applicationId: string;
  application?: Application;
  score: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  userMetadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsSummary {
  averageScore: number;
  npsScore: number;
  totalResponses: number;
}

export interface TrendPoint {
  period: string;
  averageScore: number;
  count: number;
}

export interface DistributionItem {
  score: number;
  count: number;
}

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface KeywordItem {
  term: string;
  weight: number;
}

export interface ComparisonItem {
  applicationId: string;
  applicationName: string;
  averageScore: number;
  totalResponses: number;
}

export interface FeedbackFilters {
  applicationId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sentiment?: string;
  minScore?: number;
  maxScore?: number;
}
