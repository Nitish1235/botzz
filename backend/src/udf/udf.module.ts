import { Module } from '@nestjs/common';
import { UdfController } from './udf.controller';
import { UdfService } from './udf.service';

@Module({
  controllers: [UdfController],
  providers: [UdfService],
})
export class UdfModule {}
