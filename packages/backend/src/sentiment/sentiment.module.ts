import { Module, Global } from '@nestjs/common';
import { SentimentService } from './sentiment.service';

@Global()
@Module({
  providers: [SentimentService],
  exports: [SentimentService],
})
export class SentimentModule {}
