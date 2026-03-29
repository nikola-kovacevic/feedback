import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackResponse } from './feedback-response.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { ApplicationsModule } from '../applications/applications.module';
import { AlertModule } from '../alert/alert.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackResponse]),
    ApplicationsModule,
    AlertModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
