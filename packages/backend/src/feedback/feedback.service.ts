import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackResponse, Sentiment } from './feedback-response.entity';
import { ApplicationsService } from '../applications/applications.service';
import { SentimentService } from '../sentiment/sentiment.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackResponse)
    private feedbackRepository: Repository<FeedbackResponse>,
    private applicationsService: ApplicationsService,
    private sentimentService: SentimentService,
  ) {}

  async submit(dto: SubmitFeedbackDto) {
    const application = await this.applicationsService.findByApiKey(dto.apiKey);
    if (!application) throw new NotFoundException('Application not found');

    // Validate userMetadata size (max 10KB)
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

    return this.feedbackRepository.save(feedback);
  }

  async findAll(query: QueryFeedbackDto) {
    const qb = this.feedbackRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.application', 'app')
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

  async exportAll(query: QueryFeedbackDto) {
    const qb = this.feedbackRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.application', 'app')
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
}
