import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';

@Injectable()
export class ApplicationOwnershipService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async verifyOwnership(applicationId: string, userId: string): Promise<void> {
    const app = await this.applicationsRepository.findOne({
      where: { id: applicationId, createdById: userId },
    });
    if (!app) {
      throw new ForbiddenException('You do not have access to this application');
    }
  }
}
