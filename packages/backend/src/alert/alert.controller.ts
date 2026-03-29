import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlertService } from './alert.service';

@ApiTags('alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/alerts')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Post('check')
  async triggerCheck() {
    return this.alertService.checkThresholds();
  }
}
