import { Injectable, Logger } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class UdfService {
  private exchange: ccxt.Exchange;
  private logger = new Logger(UdfService.name);

  constructor() {
    this.exchange = new ccxt.bybit({
      apiKey: 'h11fW550SC82rRh0uY',
      secret: 'bVKesrK2daHeE6QEXXMOiJPXuzj6EpSqQVUM',
      enableRateLimit: true,
    });
  }

  getConfig() {
    return {
      supported_resolutions: ['1', '5', '15', '60', '240', '1D'],
      supports_group_request: false,
      supports_marks: true,
      supports_search: true,
      supports_timescale_marks: true,
      supports_time: true,
    };
  }

  async resolveSymbol(symbol: string) {
    // In a real app, you would fetch exchange markets and find the exact symbol rules.
    // For now, mock a standard response for TradingView UDF.
    return {
      name: symbol,
      ticker: symbol,
      description: symbol,
      type: 'crypto',
      session: '24x7',
      exchange: 'Bybit',
      listed_exchange: 'Bybit',
      timezone: 'Etc/UTC',
      format: 'price',
      pricescale: 10000,
      minmov: 1,
      has_intraday: true,
      intraday_multipliers: ['1', '5', '15', '60', '240'],
      has_daily: true,
      has_weekly_and_monthly: false,
      supported_resolutions: ['1', '5', '15', '60', '240', '1D'],
      volume_precision: 8,
      data_status: 'streaming',
    };
  }

  async searchSymbols(query: string, type: string, exchange: string, limit: number) {
    // Mock response for search
    if (!query) return [];
    const q = query.toUpperCase();
    return [
      {
        symbol: `${q}USDT`,
        full_name: `BYBIT:${q}USDT`,
        description: `${q} Tether`,
        exchange: 'Bybit',
        type: 'crypto',
      },
    ];
  }

  // Convert TV resolution (1, 5, 60, 1D) to CCXT timeframe (1m, 5m, 1h, 1d)
  private mapResolutionToTimeframe(resolution: string): string {
    const map: { [key: string]: string } = {
      '1': '1m',
      '3': '3m',
      '5': '5m',
      '15': '15m',
      '30': '30m',
      '60': '1h',
      '120': '2h',
      '240': '4h',
      '1D': '1d',
      'D': '1d',
      '1W': '1w',
      'W': '1w',
      '1M': '1M',
      'M': '1M',
    };
    return map[resolution] || '1h';
  }

  async getHistory(symbol: string, from: number, to: number, resolution: string) {
    try {
      const timeframe = this.mapResolutionToTimeframe(resolution);
      const since = from * 1000;
      // Fetch OHLCV
      // Bybit API format: symbol, timeframe, since, limit
      const limit = 1000;
      let ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe, since, limit);

      // Filter by 'to' timestamp
      ohlcv = ohlcv.filter((candle) => candle[0] <= to * 1000);

      if (ohlcv.length === 0) {
        return { s: 'no_data' };
      }

      const t = [], c = [], o = [], h = [], l = [], v = [];
      ohlcv.forEach((candle) => {
        t.push(Math.floor(candle[0] / 1000));
        o.push(candle[1]);
        h.push(candle[2]);
        l.push(candle[3]);
        c.push(candle[4]);
        v.push(candle[5]);
      });

      return {
        s: 'ok',
        t, o, h, l, c, v
      };
    } catch (e) {
      this.logger.error(`Error fetching history for ${symbol}: ${e.message}`);
      return { s: 'error', errmsg: e.message };
    }
  }
}
