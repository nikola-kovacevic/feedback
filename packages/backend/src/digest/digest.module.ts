import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../applications/application.entity';
import { FeedbackResponse } from '../feedback/feedback-response.entity';
import { ActionItem } from '../action-items/action-item.entity';
import { DigestController } from './digest.controller';
import { DigestService } from './digest.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, FeedbackResponse, ActionItem])],
  controllers: [DigestController],
  providers: [DigestService],
  exports: [DigestService],
})
export class DigestModule {}
