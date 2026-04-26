import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as ccxt from 'ccxt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StreamGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('StreamGateway');
  private exchange: ccxt.Exchange;
  private activeSymbols: Set<string> = new Set();

  constructor() {
    this.exchange = new ccxt.pro.bybit({
      apiKey: 'h11fW550SC82rRh0uY',
      secret: 'bVKesrK2daHeE6QEXXMOiJPXuzj6EpSqQVUM',
      enableRateLimit: true,
    });
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(client: Socket, payload: { symbol: string; timeframe: string }) {
    const { symbol, timeframe } = payload;
    const room = `${symbol}_${timeframe}`;
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to ${room}`);

    if (!this.activeSymbols.has(room)) {
      this.activeSymbols.add(room);
      this.startWatchTicker(symbol, timeframe, room);
    }
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { symbol: string; timeframe: string }) {
    const { symbol, timeframe } = payload;
    const room = `${symbol}_${timeframe}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} unsubscribed from ${room}`);
  }

  private async startWatchTicker(symbol: string, timeframe: string, room: string) {
    try {
      while (this.activeSymbols.has(room)) {
        // ccxt pro watchOHLCV
        const ohlcv = await this.exchange.watchOHLCV(symbol, timeframe);
        if (ohlcv && ohlcv.length > 0) {
          const latest = ohlcv[ohlcv.length - 1];
          const candle = {
            time: Math.floor(latest[0] / 1000),
            open: latest[1],
            high: latest[2],
            low: latest[3],
            close: latest[4],
            volume: latest[5],
          };
          this.server.to(room).emit('candle_update', { symbol, timeframe, candle });
        }
      }
    } catch (e) {
      this.logger.error(`Error watching OHLCV for ${symbol}: ${e.message}`);
      // Try to recover
      setTimeout(() => {
        if (this.activeSymbols.has(room)) {
          this.startWatchTicker(symbol, timeframe, room);
        }
      }, 5000);
    }
  }
}
