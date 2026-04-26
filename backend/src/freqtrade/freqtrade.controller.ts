import { Controller, Get, Query } from '@nestjs/common';
import { FreqtradeService } from './freqtrade.service';

@Controller('freqtrade')
export class FreqtradeController {
  constructor(private readonly freqtradeService: FreqtradeService) {}

  @Get('ping')
  async getPing() {
    return this.freqtradeService.getPing();
  }

  @Get('status')
  async getStatus() {
    return this.freqtradeService.getStatus();
  }

  @Get('trades')
  async getTrades(@Query('limit') limit?: number) {
    return this.freqtradeService.getTrades(limit);
  }

  @Get('performance')
  async getPerformance() {
    return this.freqtradeService.getPerformance();
  }

  @Get('profit')
  async getProfit() {
    return this.freqtradeService.getProfit();
  }

  @Get('balance')
  async getBalance() {
    return this.freqtradeService.getBalance();
  }
}
