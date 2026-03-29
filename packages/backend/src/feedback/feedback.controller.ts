import {
  Controller, Get, Post, Patch, Body, Query, Param, UseGuards, Res, Request,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedbackService } from './feedback.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';

@ApiTags('feedback')
@Controller('api')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @UseGuards(ThrottlerGuard)
  @Post('widget/feedback')
  submitFeedback(@Body() dto: SubmitFeedbackDto) {
    return this.feedbackService.submit(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('feedback')
  findAll(@Query() query: QueryFeedbackDto, @Request() req: { user: { id: string } }) {
    return this.feedbackService.findAll(query, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('feedback/export')
  async exportFeedback(
    @Query() query: QueryFeedbackDto,
    @Query('format') format: string,
    @Request() req: { user: { id: string } },
    @Res() res: Response,
  ) {
    const data = await this.feedbackService.exportAll(query, req.user.id);

    if (format === 'csv') {
      const header = 'id,applicationId,score,comment,sentiment,createdAt\n';
      const rows = data
        .map((r) => {
          const safeComment = (r.comment || '').replace(/"/g, '""');
          const prefixed = /^[=+\-@]/.test(safeComment) ? '\t' + safeComment : safeComment;
          return `"${r.id}","${r.applicationId}",${r.score},"${prefixed}","${r.sentiment}","${r.createdAt.toISOString()}"`;
        })
        .join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=feedback-export.csv');
      res.send(header + rows);
    } else {
      res.json(data);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('feedback/:id/tags')
  updateTags(@Param('id') id: string, @Body('tags') tags: string[], @Request() req: { user: { id: string } }) {
    return this.feedbackService.updateTags(id, tags || [], req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('feedback/:id/resolve')
  resolve(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.feedbackService.resolve(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('feedback/:id/unresolve')
  unresolve(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.feedbackService.unresolve(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('feedback/archive-old')
  archiveOld(@Request() req: { user: { id: string } }) {
    return this.feedbackService.archiveOld(req.user.id);
  }
}
