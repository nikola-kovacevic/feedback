import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import type { FeedbackResponse, PaginatedResponse, FeedbackFilters } from '../types';

export function useFeedback(filters: FeedbackFilters) {
  return useQuery<PaginatedResponse<FeedbackResponse>>({
    queryKey: ['feedback', filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters.applicationId) params.applicationId = filters.applicationId;
      if (filters.startDate) params.dateFrom = filters.startDate;
      if (filters.endDate) params.dateTo = filters.endDate;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.sentiment) params.sentiment = filters.sentiment;
      if (filters.minScore !== undefined) params.minScore = filters.minScore;
      if (filters.maxScore !== undefined) params.maxScore = filters.maxScore;

      const { data } = await client.get('/feedback', { params });
      return data;
    },
  });
}
