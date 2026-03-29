import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

const API_KEY_GRACE_PERIOD_HOURS = 24;

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly repo: Repository<Application>,
  ) {}

  private generateApiKey(): string {
    return `fb_${randomBytes(28).toString('hex')}`;
  }

  async create(dto: CreateApplicationDto, userId: string): Promise<Application> {
    const app = this.repo.create({
      ...dto,
      apiKey: this.generateApiKey(),
      createdById: userId,
    });
    return this.repo.save(app);
  }

  async findAll(userId: string): Promise<Application[]> {
    return this.repo.find({
      where: { createdById: userId, isSystem: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Application> {
    const app = await this.repo.findOne({ where: { id, createdById: userId } });
    if (!app) {
      throw new NotFoundException('Application not found');
    }
    if (app.isSystem) {
      throw new NotFoundException('Application not found');
    }
    return app;
  }

  async update(
    id: string,
    dto: UpdateApplicationDto,
    userId: string,
  ): Promise<Application> {
    const app = await this.findOne(id, userId);
    Object.assign(app, dto);
    return this.repo.save(app);
  }

  async remove(id: string, userId: string): Promise<{ deleted: boolean }> {
    const app = await this.findOne(id, userId);
    await this.repo.remove(app);
    return { deleted: true };
  }

  async regenerateKey(id: string, userId: string): Promise<Application> {
    const app = await this.findOne(id, userId);

    app.previousApiKey = app.apiKey;
    app.previousApiKeyExpiresAt = new Date(
      Date.now() + API_KEY_GRACE_PERIOD_HOURS * 60 * 60 * 1000,
    );
    app.apiKey = this.generateApiKey();

    return this.repo.save(app);
  }

  async findByApiKey(apiKey: string): Promise<Application | null> {
    // Check current key first
    const app = await this.repo.findOne({ where: { apiKey } });
    if (app) return app;

    // Check previous key within grace period
    const result = await this.repo
      .createQueryBuilder('app')
      .where('app.previousApiKey = :apiKey', { apiKey })
      .andWhere('app.previousApiKeyExpiresAt > NOW()')
      .getOne();

    return result ?? null;
  }
}
