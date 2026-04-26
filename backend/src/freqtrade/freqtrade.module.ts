import { Module } from '@nestjs/common';
import { FreqtradeService } from './freqtrade.service';
import { FreqtradeController } from './freqtrade.controller';

@Module({
  providers: [FreqtradeService],
  controllers: [FreqtradeController],
  exports: [FreqtradeService],
})
export class FreqtradeModule {}
