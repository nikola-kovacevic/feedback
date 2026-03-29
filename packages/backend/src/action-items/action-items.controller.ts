import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionItemsService } from './action-items.service';
import { CreateActionItemDto } from './dto/create-action-item.dto';

@ApiTags('action-items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/action-items')
export class ActionItemsController {
  constructor(private actionItemsService: ActionItemsService) {}

  @Post()
  create(@Body() dto: CreateActionItemDto, @Request() req: { user: { id: string } }) {
    return this.actionItemsService.create(dto, req.user.id);
  }

  @Get()
  findByApplication(
    @Query('applicationId') applicationId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.actionItemsService.findByApplication(applicationId, req.user.id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.actionItemsService.complete(id, req.user.id);
  }

  @Patch(':id/uncomplete')
  uncomplete(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.actionItemsService.uncomplete(id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.actionItemsService.remove(id, req.user.id);
  }
}
