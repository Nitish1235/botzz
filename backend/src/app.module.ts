import { Module } from '@nestjs/common';
import { UdfModule } from './udf/udf.module';
import { StreamModule } from './stream/stream.module';

import { FreqtradeModule } from './freqtrade/freqtrade.module';

@Module({
  imports: [UdfModule, StreamModule, FreqtradeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
