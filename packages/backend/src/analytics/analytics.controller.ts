import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
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
  getSummary(@Query() query: AnalyticsQueryDto, @Request() req: { user: { id: string } }) {
    return this.analyticsService.getSummary(query, req.user.id);
  }

  @Get('trends')
  getTrends(@Query() query: AnalyticsQueryDto, @Request() req: { user: { id: string } }) {
    return this.analyticsService.getTrends(query, req.user.id);
  }

  @Get('distribution')
  getDistribution(@Query() query: AnalyticsQueryDto, @Request() req: { user: { id: string } }) {
    return this.analyticsService.getDistribution(query, req.user.id);
  }

  @Get('sentiment')
  getSentiment(@Query() query: AnalyticsQueryDto, @Request() req: { user: { id: string } }) {
    return this.analyticsService.getSentimentBreakdown(query, req.user.id);
  }

  @Get('word-cloud')
  getWordCloud(@Query() query: AnalyticsQueryDto, @Request() req: { user: { id: string } }) {
    return this.analyticsService.getWordCloud(query, req.user.id);
  }

  @Get('comparison')
  getComparison(@Query() query: AnalyticsQueryDto, @Request() req: { user: { id: string } }) {
    return this.analyticsService.getComparison(query, req.user.id);
  }
}
