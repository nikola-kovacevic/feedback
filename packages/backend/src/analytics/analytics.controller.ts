import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSummary(query);
  }

  @Get('trends')
  getTrends(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getTrends(query);
  }

  @Get('distribution')
  getDistribution(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDistribution(query);
  }

  @Get('sentiment')
  getSentiment(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSentimentBreakdown(query);
  }

  @Get('word-cloud')
  getWordCloud(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getWordCloud(query);
  }

  @Get('comparison')
  getComparison(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getComparison(query);
  }
}
