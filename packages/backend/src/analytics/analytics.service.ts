import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FeedbackResponse } from '../feedback/feedback-response.entity';
import { SentimentService } from '../sentiment/sentiment.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(FeedbackResponse)
    private feedbackRepository: Repository<FeedbackResponse>,
    private sentimentService: SentimentService,
  ) {}

  private applyFilters(
    qb: SelectQueryBuilder<FeedbackResponse>,
    query: AnalyticsQueryDto,
    userId: string,
  ) {
    qb.innerJoin('f.application', 'app')
      .andWhere('app.createdById = :userId', { userId });

    if (query.applicationId) {
      qb.andWhere('f.applicationId = :applicationId', { applicationId: query.applicationId });
    }
    if (query.dateFrom) {
      qb.andWhere('f.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('f.createdAt < :dateTo', {
        dateTo: new Date(new Date(query.dateTo).getTime() + 86400000).toISOString(),
      });
    }
    return qb;
  }

  async getSummary(query: AnalyticsQueryDto, userId: string) {
    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query, userId);

    const result = await qb
      .select('AVG(f.score)', 'averageScore')
      .addSelect('COUNT(*)', 'totalResponses')
      .addSelect('COUNT(*) FILTER (WHERE f.score >= 9)', 'promoters')
      .addSelect('COUNT(*) FILTER (WHERE f.score <= 6)', 'detractors')
      .getRawOne();

    const total = parseInt(result.totalResponses) || 0;
    const promoters = parseInt(result.promoters) || 0;
    const detractors = parseInt(result.detractors) || 0;
    const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

    return { averageScore: parseFloat(result.averageScore) || 0, npsScore, totalResponses: total };
  }

  async getDistribution(query: AnalyticsQueryDto, userId: string) {
    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query, userId);

    const results = await qb
      .select('f.score', 'score')
      .addSelect('COUNT(*)', 'count')
      .groupBy('f.score')
      .orderBy('f.score', 'ASC')
      .getRawMany();

    const distribution = Array.from({ length: 11 }, (_, i) => ({ score: i, count: 0 }));
    results.forEach((r) => { distribution[r.score].count = parseInt(r.count); });
    return distribution;
  }

  async getTrends(query: AnalyticsQueryDto, userId: string) {
    const granularity = query.granularity || 'daily';
    const truncTo = granularity === 'monthly' ? 'month' : granularity === 'weekly' ? 'week' : 'day';

    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query, userId);

    const results = await qb
      .select(`DATE_TRUNC('${truncTo}', f."createdAt")`, 'period')
      .addSelect('AVG(f.score)', 'averageScore')
      .addSelect('COUNT(*)', 'count')
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return results.map((r) => ({
      period: r.period,
      averageScore: parseFloat(r.averageScore) || 0,
      count: parseInt(r.count) || 0,
    }));
  }

  async getSentimentBreakdown(query: AnalyticsQueryDto, userId: string) {
    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query, userId);

    const results = await qb
      .select('f.sentiment', 'sentiment')
      .addSelect('COUNT(*)', 'count')
      .groupBy('f.sentiment')
      .getRawMany();

    const breakdown = { positive: 0, negative: 0, neutral: 0 };
    results.forEach((r) => {
      breakdown[r.sentiment as keyof typeof breakdown] = parseInt(r.count);
    });
    return breakdown;
  }

  async getWordCloud(query: AnalyticsQueryDto, userId: string) {
    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query, userId);
    qb.andWhere('f.comment IS NOT NULL');
    qb.take(1000);

    const feedbacks = await qb.getMany();
    const comments = feedbacks.map((f) => f.comment).filter(Boolean);
    return this.sentimentService.extractKeywords(comments, 30);
  }

  async getComparison(query: AnalyticsQueryDto, userId: string) {
    const qb = this.feedbackRepository
      .createQueryBuilder('f')
      .innerJoin('f.application', 'app')
      .where('app.createdById = :userId', { userId });

    if (query.dateFrom) {
      qb.andWhere('f.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('f.createdAt < :dateTo', {
        dateTo: new Date(new Date(query.dateTo).getTime() + 86400000).toISOString(),
      });
    }

    const results = await qb
      .select('f.applicationId', 'applicationId')
      .addSelect('app.name', 'applicationName')
      .addSelect('AVG(f.score)', 'averageScore')
      .addSelect('COUNT(*)', 'totalResponses')
      .groupBy('f.applicationId')
      .addGroupBy('app.name')
      .getRawMany();

    return results.map((r) => ({
      applicationId: r.applicationId,
      applicationName: r.applicationName,
      averageScore: parseFloat(r.averageScore) || 0,
      totalResponses: parseInt(r.totalResponses) || 0,
    }));
  }
}
