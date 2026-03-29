import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../applications/application.entity';
import { FeedbackResponse } from '../feedback/feedback-response.entity';
import { ActionItem } from '../action-items/action-item.entity';

export interface DigestData {
  appName: string;
  appId: string;
  periodStart: string;
  periodEnd: string;
  totalResponses: number;
  averageScore: number;
  npsScore: number;
  topTags: Array<{ tag: string; count: number }>;
  completedActions: Array<{ text: string; tag: string | null; completedAt: string }>;
  recentComments: Array<{ score: number; comment: string; sentiment: string }>;
  generatedAt: string;
}

@Injectable()
export class DigestService {
  private readonly logger = new Logger(DigestService.name);
  private latestDigests = new Map<string, DigestData>();

  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(FeedbackResponse)
    private feedbackRepository: Repository<FeedbackResponse>,
    @InjectRepository(ActionItem)
    private actionItemsRepository: Repository<ActionItem>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async generateAllDigests() {
    this.logger.log('Generating weekly digests for all applications...');
    const apps = await this.applicationsRepository.find();
    let generated = 0;

    for (const app of apps) {
      const digest = await this.generateDigest(app.id);
      if (digest.totalResponses > 0) {
        this.latestDigests.set(app.id, digest);
        generated++;
      }
    }

    this.logger.log(`Generated ${generated} digest(s).`);
  }

  async generateDigest(appId: string): Promise<DigestData> {
    const app = await this.applicationsRepository.findOne({ where: { id: appId } });
    if (!app) throw new NotFoundException('Application not found');

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Feedback from last 7 days
    const feedback = await this.feedbackRepository
      .createQueryBuilder('f')
      .where('f.applicationId = :appId', { appId })
      .andWhere('f.createdAt >= :since', { since: weekAgo })
      .orderBy('f.createdAt', 'DESC')
      .getMany();

    const totalResponses = feedback.length;
    const averageScore = totalResponses > 0
      ? feedback.reduce((sum, f) => sum + f.score, 0) / totalResponses
      : 0;

    // NPS calculation
    const promoters = feedback.filter(f => f.score >= 9).length;
    const detractors = feedback.filter(f => f.score <= 6).length;
    const npsScore = totalResponses > 0
      ? Math.round(((promoters - detractors) / totalResponses) * 100)
      : 0;

    // Top tags from this week's feedback
    const tagCounts = new Map<string, number>();
    feedback.forEach(f => {
      (f.tags || []).forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Completed action items from last 7 days
    const completedActions = await this.actionItemsRepository
      .createQueryBuilder('a')
      .where('a.applicationId = :appId', { appId })
      .andWhere('a.completed = true')
      .andWhere('a.updatedAt >= :since', { since: weekAgo })
      .orderBy('a.updatedAt', 'DESC')
      .getMany();

    // Recent comments (top 5 with comments)
    const recentComments = feedback
      .filter(f => f.comment)
      .slice(0, 5)
      .map(f => ({ score: f.score, comment: f.comment, sentiment: f.sentiment }));

    const digest: DigestData = {
      appName: app.name,
      appId: app.id,
      periodStart: weekAgo.toISOString(),
      periodEnd: now.toISOString(),
      totalResponses,
      averageScore: parseFloat(averageScore.toFixed(1)),
      npsScore,
      topTags,
      completedActions: completedActions.map(a => ({
        text: a.text,
        tag: a.tag,
        completedAt: a.updatedAt.toISOString(),
      })),
      recentComments,
      generatedAt: now.toISOString(),
    };

    this.latestDigests.set(appId, digest);
    return digest;
  }

  getLatestDigest(appId: string): DigestData | null {
    return this.latestDigests.get(appId) || null;
  }
}
