import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionItem } from './action-item.entity';
import { ActionItemsController } from './action-items.controller';
import { ActionItemsService } from './action-items.service';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActionItem]),
    ApplicationsModule,
  ],
  controllers: [ActionItemsController],
  providers: [ActionItemsService],
  exports: [ActionItemsService],
})
export class ActionItemsModule {}
