import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { UdfService } from './udf.service';

@Controller('udf')
export class UdfController {
  constructor(private readonly udfService: UdfService) {}

  @Get('config')
  getConfig() {
    return this.udfService.getConfig();
  }

  @Get('time')
  getTime() {
    return Math.floor(Date.now() / 1000);
  }

  @Get('symbols')
  async getSymbol(@Query('symbol') symbol: string) {
    return this.udfService.resolveSymbol(symbol);
  }

  @Get('search')
  async searchSymbols(
    @Query('query') query: string,
    @Query('type') type: string,
    @Query('exchange') exchange: string,
    @Query('limit') limit: string,
  ) {
    return this.udfService.searchSymbols(query, type, exchange, Number(limit));
  }

  @Get('history')
  async getHistory(
    @Query('symbol') symbol: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('resolution') resolution: string,
  ) {
    return this.udfService.getHistory(
      symbol,
      Number(from),
      Number(to),
      resolution,
    );
  }
}
