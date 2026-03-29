import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackResponse, Sentiment } from './feedback-response.entity';
import { ApplicationsService } from '../applications/applications.service';
import { ApplicationOwnershipService } from '../applications/application-ownership.guard';
import { SentimentService } from '../sentiment/sentiment.service';
import { AlertService } from '../alert/alert.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackResponse)
    private feedbackRepository: Repository<FeedbackResponse>,
    private applicationsService: ApplicationsService,
    private ownershipService: ApplicationOwnershipService,
    private sentimentService: SentimentService,
    private alertService: AlertService,
  ) {}

  async submit(dto: SubmitFeedbackDto) {
    const application = await this.applicationsService.findByApiKey(dto.apiKey);
    if (!application) throw new NotFoundException('Application not found');

    if (dto.userMetadata) {
      const metadataSize = JSON.stringify(dto.userMetadata).length;
      if (metadataSize > 10240) {
        throw new BadRequestException('userMetadata exceeds maximum size of 10KB');
      }
    }

    const sentiment = this.sentimentService.analyzeSentiment(dto.comment || '') as Sentiment;

    const feedback = this.feedbackRepository.create({
      applicationId: application.id,
      score: dto.score,
      comment: dto.comment,
      sentiment,
      userMetadata: dto.userMetadata,
    });

    const saved = await this.feedbackRepository.save(feedback);

    // Check alert threshold in background (don't block response)
    this.alertService.checkSingleApp(application.id).catch(() => {});

    return saved;
  }

  async findAll(query: QueryFeedbackDto, userId: string) {
    // If filtering by applicationId, verify ownership
    if (query.applicationId) {
      await this.ownershipService.verifyOwnership(query.applicationId, userId);
    }

    const qb = this.feedbackRepository
      .createQueryBuilder('f')
      .leftJoin('f.application', 'app')
      .addSelect(['app.id', 'app.name'])
      .where('app.createdById = :userId', { userId })
      .orderBy('f.createdAt', 'DESC');

    if (query.applicationId) {
      qb.andWhere('f.applicationId = :applicationId', { applicationId: query.applicationId });
    }
    if (query.dateFrom) {
      qb.andWhere('f.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('f.createdAt < :dateTo', { dateTo: new Date(new Date(query.dateTo).getTime() + 86400000).toISOString() });
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async exportAll(query: QueryFeedbackDto, userId: string) {
    if (query.applicationId) {
      await this.ownershipService.verifyOwnership(query.applicationId, userId);
    }

    const qb = this.feedbackRepository
      .createQueryBuilder('f')
      .leftJoin('f.application', 'app')
      .addSelect(['app.id', 'app.name'])
      .where('app.createdById = :userId', { userId })
      .orderBy('f.createdAt', 'DESC');

    if (query.applicationId) {
      qb.andWhere('f.applicationId = :applicationId', { applicationId: query.applicationId });
    }
    if (query.dateFrom) {
      qb.andWhere('f.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('f.createdAt < :dateTo', { dateTo: new Date(new Date(query.dateTo).getTime() + 86400000).toISOString() });
    }

    return qb.getMany();
  }

  private async verifyFeedbackOwnership(feedbackId: string, userId: string) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id: feedbackId },
      relations: ['application'],
    });
    if (!feedback) throw new NotFoundException('Feedback not found');
    if (feedback.application.createdById !== userId) {
      throw new ForbiddenException('You do not have access to this feedback');
    }
    return feedback;
  }

  async updateTags(id: string, tags: string[], userId: string) {
    const feedback = await this.verifyFeedbackOwnership(id, userId);
    feedback.tags = tags;
    return this.feedbackRepository.save(feedback);
  }

  async resolve(id: string, userId: string) {
    const feedback = await this.verifyFeedbackOwnership(id, userId);
    feedback.resolved = true;
    return this.feedbackRepository.save(feedback);
  }

  async unresolve(id: string, userId: string) {
    const feedback = await this.verifyFeedbackOwnership(id, userId);
    feedback.resolved = false;
    return this.feedbackRepository.save(feedback);
  }

  async archiveOld() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const result = await this.feedbackRepository
      .createQueryBuilder()
      .update(FeedbackResponse)
      .set({ archivedAt: new Date() })
      .where('createdAt < :cutoff', { cutoff: twelveMonthsAgo })
      .andWhere('archivedAt IS NULL')
      .execute();

    return { archived: result.affected || 0 };
  }
}
