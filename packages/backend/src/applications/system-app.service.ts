import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Application } from './application.entity';

@Injectable()
export class SystemAppService implements OnModuleInit {
  private readonly logger = new Logger(SystemAppService.name);

  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async onModuleInit() {
    await this.ensureSystemApp();
  }

  private loadSystemIcon(): string | null {
    // Try multiple paths (local dev vs Docker)
    const candidates = [
      path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'favicon.png'),
      path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'assets', 'pulseloop.png'),
    ];
    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) {
          const buf = fs.readFileSync(p);
          return `data:image/png;base64,${buf.toString('base64')}`;
        }
      } catch { /* ignore */ }
    }
    return null;
  }

  private async ensureSystemApp() {
    const existing = await this.applicationsRepository.findOne({
      where: { isSystem: true },
    });

    if (existing) {
      this.logger.log(`System app exists: ${existing.name} (${existing.apiKey})`);
      return;
    }

    const systemApp = this.applicationsRepository.create({
      name: 'PulseLoop',
      description: 'Rate your experience with PulseLoop. Your feedback helps us improve.',
      isSystem: true,
      // icon: frontend uses imported pulseloop.png for system apps
      apiKey: `fbk_system_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
      widgetConfig: {
        mode: 'floating',
        question: 'How would you rate your PulseLoop experience?',
        commentRequired: false,
        themeColor: '#0eb4a1',
        cooldownHours: 168,
        position: 'bottom-right',
      },
      createdById: '00000000-0000-0000-0000-000000000000',
    });

    try {
      await this.applicationsRepository.save(systemApp);
      this.logger.log(`System app created: PulseLoop (${systemApp.apiKey})`);
    } catch (err) {
      // May fail if FK constraint requires real user. That's OK.
      this.logger.warn(`Could not create system app (user FK constraint). Will retry when first user registers.`);
    }
  }

  async getSystemApp(): Promise<Application | null> {
    return this.applicationsRepository.findOne({ where: { isSystem: true } });
  }

  async ensureSystemAppWithUser(userId: string) {
    const existing = await this.applicationsRepository.findOne({
      where: { isSystem: true },
    });
    if (existing) return existing;

    const systemApp = this.applicationsRepository.create({
      name: 'PulseLoop',
      description: 'Rate your experience with PulseLoop. Your feedback helps us improve.',
      isSystem: true,
      // icon: frontend uses imported pulseloop.png for system apps
      apiKey: `fbk_system_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
      widgetConfig: {
        mode: 'floating',
        question: 'How would you rate your PulseLoop experience?',
        commentRequired: false,
        themeColor: '#0eb4a1',
        cooldownHours: 168,
        position: 'bottom-right',
      },
      createdById: userId,
    });

    return this.applicationsRepository.save(systemApp);
  }
}
