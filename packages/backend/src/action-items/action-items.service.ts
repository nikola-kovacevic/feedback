import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionItem } from './action-item.entity';
import { CreateActionItemDto } from './dto/create-action-item.dto';

@Injectable()
export class ActionItemsService {
  constructor(
    @InjectRepository(ActionItem)
    private actionItemsRepository: Repository<ActionItem>,
  ) {}

  async create(dto: CreateActionItemDto) {
    const item = this.actionItemsRepository.create(dto);
    return this.actionItemsRepository.save(item);
  }

  async findByApplication(applicationId: string) {
    return this.actionItemsRepository.find({
      where: { applicationId },
      order: { completed: 'ASC', createdAt: 'DESC' },
    });
  }

  async complete(id: string) {
    const item = await this.actionItemsRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Action item not found');
    item.completed = true;
    return this.actionItemsRepository.save(item);
  }

  async uncomplete(id: string) {
    const item = await this.actionItemsRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Action item not found');
    item.completed = false;
    return this.actionItemsRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.actionItemsRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Action item not found');
    await this.actionItemsRepository.remove(item);
    return { deleted: true };
  }
}
