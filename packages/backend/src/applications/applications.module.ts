import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationOwnershipService } from './application-ownership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationOwnershipService],
  exports: [ApplicationsService, ApplicationOwnershipService],
})
export class ApplicationsModule {}
