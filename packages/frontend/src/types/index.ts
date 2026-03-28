export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WidgetConfig {
  id: string;
  applicationId: string;
  type: 'nps' | 'csat' | 'ces' | 'custom';
  title: string;
  question: string;
  thankYouMessage: string;
  position: 'bottom-right' | 'bottom-left' | 'center';
  theme: Record<string, string>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackResponse {
  id: string;
  applicationId: string;
  widgetId: string;
  score: number;
  comment: string;
  metadata: Record<string, unknown>;
  sentiment: 'positive' | 'neutral' | 'negative';
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsSummary {
  totalResponses: number;
  averageScore: number;
  npsScore: number;
  responseRate: number;
  promoters: number;
  passives: number;
  detractors: number;
}

export interface TrendPoint {
  date: string;
  averageScore: number;
  responseCount: number;
}

export interface DistributionItem {
  score: number;
  count: number;
  percentage: number;
}

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export interface KeywordItem {
  keyword: string;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ComparisonItem {
  applicationId: string;
  applicationName: string;
  averageScore: number;
  totalResponses: number;
  npsScore: number;
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
