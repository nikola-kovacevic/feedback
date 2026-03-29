import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionItem } from './action-item.entity';
import { ApplicationOwnershipService } from '../applications/application-ownership.guard';
import { CreateActionItemDto } from './dto/create-action-item.dto';

@Injectable()
export class ActionItemsService {
  constructor(
    @InjectRepository(ActionItem)
    private actionItemsRepository: Repository<ActionItem>,
    private ownershipService: ApplicationOwnershipService,
  ) {}

  async create(dto: CreateActionItemDto, userId: string) {
    await this.ownershipService.verifyOwnership(dto.applicationId, userId);
    const item = this.actionItemsRepository.create(dto);
    return this.actionItemsRepository.save(item);
  }

  async findByApplication(applicationId: string, userId: string) {
    await this.ownershipService.verifyOwnership(applicationId, userId);
    return this.actionItemsRepository.find({
      where: { applicationId },
      order: { completed: 'ASC', createdAt: 'DESC' },
    });
  }

  private async findAndVerifyOwnership(id: string, userId: string) {
    const item = await this.actionItemsRepository.findOne({
      where: { id },
      relations: ['application'],
    });
    if (!item) throw new NotFoundException('Action item not found');
    if (item.application.createdById !== userId) {
      throw new ForbiddenException('You do not have access to this action item');
    }
    return item;
  }

  async complete(id: string, userId: string) {
    const item = await this.findAndVerifyOwnership(id, userId);
    item.completed = true;
    return this.actionItemsRepository.save(item);
  }

  async uncomplete(id: string, userId: string) {
    const item = await this.findAndVerifyOwnership(id, userId);
    item.completed = false;
    return this.actionItemsRepository.save(item);
  }

  async remove(id: string, userId: string) {
    const item = await this.findAndVerifyOwnership(id, userId);
    await this.actionItemsRepository.remove(item);
    return { deleted: true };
  }
}
