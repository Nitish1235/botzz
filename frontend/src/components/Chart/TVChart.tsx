'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries, Time } from 'lightweight-charts';

interface ChartProps {
  symbol: string;
  timeframe: string;
}

export const TVChart: React.FC<ChartProps> = ({ symbol, timeframe }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  // References to keep track of chart and series for updates
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#111827' }, // Dark background
        textColor: '#D1D5DB', // Light gray text
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600, // Fixed height or 100% of container
      crosshair: {
        mode: 1, // Normal crosshair
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });
    
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });
    
    candlestickSeriesRef.current = candlestickSeries;

    window.addEventListener('resize', handleResize);

    const loadHistoricalData = async () => {
      try {
        // Map common timeframes to Binance intervals
        const tfMap: Record<string, string> = {
          '1m': '1m', '5m': '5m', '15m': '15m', '1h': '1h', '4h': '4h', '1d': '1d'
        };
        const interval = tfMap[timeframe] || '1h';
        const binanceSymbol = symbol.replace('/', '').toUpperCase(); // BTCUSDT

        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=1000`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const formattedData = data.map((d: any) => ({
            time: (d[0] / 1000) as Time,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          }));
          
          candlestickSeries.setData(formattedData);
          // Load trades after historical data is set
          loadTrades();
        }
      } catch (err) {
        console.error("Failed to load historical data", err);
      }
    };

    const loadTrades = async () => {
      try {
        const res = await fetch(`http://localhost:3001/freqtrade/trades?limit=500`);
        const data = await res.json();
        
        if (data && data.trades) {
          const markers: any[] = [];
          data.trades.forEach((trade: any) => {
            // Only show markers for the current symbol
            if (trade.pair === symbol || trade.pair === symbol.replace('/', '_')) {
              // Open Marker (Buy)
              const openTime = Math.floor(new Date(trade.open_date).getTime() / 1000);
              markers.push({
                time: openTime as Time,
                position: 'belowBar',
                color: '#10B981',
                shape: 'arrowUp',
                text: `BUY @ ${trade.open_rate}`,
              });

              // Close Marker (Sell) if trade is closed
              if (!trade.is_open && trade.close_date) {
                const closeTime = Math.floor(new Date(trade.close_date).getTime() / 1000);
                markers.push({
                  time: closeTime as Time,
                  position: 'aboveBar',
                  color: '#EF4444',
                  shape: 'arrowDown',
                  text: `SELL @ ${trade.close_rate} (${(trade.profit_ratio * 100).toFixed(2)}%)`,
                });
              }
            }
          });
          
          // Sort markers by time as required by lightweight-charts
          markers.sort((a, b) => (a.time as number) - (b.time as number));
          (candlestickSeries as any).setMarkers(markers);
        }
      } catch (err) {
        console.error("Failed to load trades", err);
      }
    };

    loadHistoricalData();

    // Setup Direct Binance WebSocket
    const binanceSymbolLower = symbol.replace('/', '').toLowerCase();
    const interval = timeframe || '1h';
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbolLower}@kline_${interval}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.e === 'kline') {
        const kline = message.k;
        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.update({
            time: (kline.t / 1000) as Time,
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
          });
        }
      }
    };

    // Polling for new trades every 30 seconds
    const tradeInterval = setInterval(loadTrades, 30000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(tradeInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
      chart.remove();
    };
  }, [symbol, timeframe]);

  return (
    <div className="w-full h-[600px] border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative">
       {/* UI Overlays can go here, like loading spinners or legend */}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
