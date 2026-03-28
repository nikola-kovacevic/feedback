import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import type {
  AnalyticsSummary,
  TrendPoint,
  DistributionItem,
  SentimentBreakdown,
  KeywordItem,
  ComparisonItem,
} from '../types';

interface AnalyticsParams {
  applicationId?: string;
  startDate?: string;
  endDate?: string;
}

function buildParams(params: AnalyticsParams): Record<string, string> {
  const result: Record<string, string> = {};
  if (params.applicationId) result.applicationId = params.applicationId;
  if (params.startDate) result.dateFrom = params.startDate;
  if (params.endDate) result.dateTo = params.endDate;
  return result;
}

const QUERY_OPTIONS = {
  staleTime: 0,
  refetchOnMount: true as const,
  refetchOnWindowFocus: true as const,
};

export function useSummary(params: AnalyticsParams = {}) {
  return useQuery<AnalyticsSummary>({
    queryKey: ['analytics', 'summary', params],
    queryFn: async () => {
      const { data } = await client.get('/analytics/summary', {
        params: buildParams(params),
      });
      return data;
    },
    ...QUERY_OPTIONS,
  });
}

export function useTrends(params: AnalyticsParams = {}) {
  return useQuery<TrendPoint[]>({
    queryKey: ['analytics', 'trends', params],
    queryFn: async () => {
      const { data } = await client.get('/analytics/trends', {
        params: buildParams(params),
      });
      return data;
    },
    ...QUERY_OPTIONS,
  });
}

export function useDistribution(params: AnalyticsParams = {}) {
  return useQuery<DistributionItem[]>({
    queryKey: ['analytics', 'distribution', params],
    queryFn: async () => {
      const { data } = await client.get('/analytics/distribution', {
        params: buildParams(params),
      });
      return data;
    },
    ...QUERY_OPTIONS,
  });
}

export function useSentiment(params: AnalyticsParams = {}) {
  return useQuery<SentimentBreakdown>({
    queryKey: ['analytics', 'sentiment', params],
    queryFn: async () => {
      const { data } = await client.get('/analytics/sentiment', {
        params: buildParams(params),
      });
      return data;
    },
    ...QUERY_OPTIONS,
  });
}

export function useWordCloud(params: AnalyticsParams = {}) {
  return useQuery<KeywordItem[]>({
    queryKey: ['analytics', 'word-cloud', params],
    queryFn: async () => {
      const { data } = await client.get('/analytics/word-cloud', {
        params: buildParams(params),
      });
      return data;
    },
    ...QUERY_OPTIONS,
  });
}

export function useComparison() {
  return useQuery<ComparisonItem[]>({
    queryKey: ['analytics', 'comparison'],
    queryFn: async () => {
      const { data } = await client.get('/analytics/comparison');
      return data;
    },
    ...QUERY_OPTIONS,
  });
}
