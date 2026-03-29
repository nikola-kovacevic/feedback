import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../applications/application.entity';
import { FeedbackResponse } from '../feedback/feedback-response.entity';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(FeedbackResponse)
    private feedbackRepository: Repository<FeedbackResponse>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkThresholds() {
    this.logger.log('Running daily NPS threshold check...');

    const apps = await this.applicationsRepository.find();
    let alertsSent = 0;

    for (const app of apps) {
      if (!app.alertConfig?.enabled || !app.alertConfig?.slackUrl) continue;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await this.feedbackRepository
        .createQueryBuilder('f')
        .select('COUNT(*)', 'total')
        .addSelect('COUNT(*) FILTER (WHERE f.score >= 9)', 'promoters')
        .addSelect('COUNT(*) FILTER (WHERE f.score <= 6)', 'detractors')
        .where('f.applicationId = :appId', { appId: app.id })
        .andWhere('f.createdAt >= :since', { since: sevenDaysAgo })
        .getRawOne();

      const total = parseInt(result.total) || 0;
      if (total === 0) continue; // No feedback in last 7 days, skip

      const promoters = parseInt(result.promoters) || 0;
      const detractors = parseInt(result.detractors) || 0;
      const nps = Math.round(((promoters - detractors) / total) * 100);

      if (nps < app.alertConfig.npsThreshold) {
        await this.sendSlackAlert(app, nps, total);
        alertsSent++;
      }
    }

    this.logger.log(`Threshold check complete. ${alertsSent} alert(s) sent.`);
  }

  async checkSingleApp(appId: string) {
    const app = await this.applicationsRepository.findOne({ where: { id: appId } });
    if (!app?.alertConfig?.enabled || !app?.alertConfig?.slackUrl) return;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await this.feedbackRepository
      .createQueryBuilder('f')
      .select('COUNT(*)', 'total')
      .addSelect('COUNT(*) FILTER (WHERE f.score >= 9)', 'promoters')
      .addSelect('COUNT(*) FILTER (WHERE f.score <= 6)', 'detractors')
      .where('f.applicationId = :appId', { appId })
      .andWhere('f.createdAt >= :since', { since: sevenDaysAgo })
      .getRawOne();

    const total = parseInt(result.total) || 0;
    if (total === 0) return;

    const promoters = parseInt(result.promoters) || 0;
    const detractors = parseInt(result.detractors) || 0;
    const nps = Math.round(((promoters - detractors) / total) * 100);

    if (nps < app.alertConfig.npsThreshold) {
      await this.sendSlackAlert(app, nps, total);
    }
  }

  private async sendSlackAlert(app: Application, nps: number, responseCount: number) {
    try {
      await fetch(app.alertConfig!.slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `⚠️ *PulseLoop Alert: ${app.name}*\nNPS dropped to *${nps}* (threshold: ${app.alertConfig!.npsThreshold})\nBased on ${responseCount} responses in the last 7 days.`,
        }),
      });
      this.logger.log(`Alert sent for ${app.name} (NPS: ${nps})`);
    } catch (err) {
      this.logger.error(`Failed to send Slack alert for ${app.name}: ${err}`);
    }
  }
}
