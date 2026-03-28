import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from '../applications/applications.service';

@ApiTags('widget')
@Controller('api/widget')
export class WidgetController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get('config/:apiKey')
  async getConfig(@Param('apiKey') apiKey: string) {
    const app = await this.applicationsService.findByApiKey(apiKey);
    if (!app) throw new NotFoundException('Application not found');
    return app.widgetConfig;
  }
}
