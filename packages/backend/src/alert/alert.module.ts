import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../applications/application.entity';
import { FeedbackResponse } from '../feedback/feedback-response.entity';
import { AlertService } from './alert.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, FeedbackResponse])],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
