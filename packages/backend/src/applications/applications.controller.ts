import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, Request, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { SystemAppService } from './system-app.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly systemAppService: SystemAppService,
  ) {}

  @Get('system')
  async getSystemApp(@Request() req: { user: { id: string } }) {
    const app = await this.systemAppService.getSystemApp();
    if (!app) {
      // Create on first request with the first user
      return this.systemAppService.ensureSystemAppWithUser(req.user.id);
    }
    return app;
  }

  @Post()
  create(
    @Body() dto: CreateApplicationDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.applicationsService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Request() req: { user: { id: string } }) {
    return this.applicationsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.applicationsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.applicationsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.applicationsService.remove(id, req.user.id);
  }

  @Post(':id/regenerate-key')
  regenerateKey(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.applicationsService.regenerateKey(id, req.user.id);
  }
}
