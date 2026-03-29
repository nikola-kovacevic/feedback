import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';
import { SentimentModule } from './sentiment/sentiment.module';
import { FeedbackModule } from './feedback/feedback.module';
import { WidgetModule } from './widget/widget.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ActionItemsModule } from './action-items/action-items.module';
import { AlertModule } from './alert/alert.module';
import { DigestModule } from './digest/digest.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ApplicationsModule,
    SentimentModule,
    FeedbackModule,
    WidgetModule,
    AnalyticsModule,
    ActionItemsModule,
    AlertModule,
    DigestModule,
  ],
})
export class AppModule {}
