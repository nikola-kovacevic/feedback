import { Module } from '@nestjs/common';
import { WidgetController } from './widget.controller';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [ApplicationsModule],
  controllers: [WidgetController],
})
export class WidgetModule {}
