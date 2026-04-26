import { useMemo } from 'react';
import { RSI, MACD, EMA } from 'technicalindicators';

export interface IndicatorData {
  time: number;
  value: number;
}

export interface MACDData {
  time: number;
  MACD?: number;
  signal?: number;
  histogram?: number;
}

export const useIndicators = (data: { time: number; close: number }[]) => {
  const rsiData = useMemo(() => {
    if (data.length < 14) return [];
    const closes = data.map(d => d.close);
    const rsi = RSI.calculate({ period: 14, values: closes });
    
    // RSI calculation returns an array smaller than input array by `period` elements
    return rsi.map((val, idx) => ({
      time: data[idx + 14].time,
      value: val,
    }));
  }, [data]);

  const macdData = useMemo(() => {
    if (data.length < 26) return [];
    const closes = data.map(d => d.close);
    const macd = MACD.calculate({
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });

    return macd.map((val, idx) => ({
      time: data[idx + 26].time, // Approx offset
      MACD: val.MACD,
      signal: val.signal,
      histogram: val.histogram
    }));
  }, [data]);

  const emaData = useMemo(() => {
    if (data.length < 20) return { ema20: [], ema50: [], ema200: [] };
    const closes = data.map(d => d.close);
    
    const ema20Raw = EMA.calculate({ period: 20, values: closes });
    const ema50Raw = EMA.calculate({ period: 50, values: closes });
    const ema200Raw = EMA.calculate({ period: 200, values: closes });

    return {
      ema20: ema20Raw.map((val, idx) => ({ time: data[idx + 20 - 1].time, value: val })),
      ema50: ema50Raw.map((val, idx) => ({ time: data[idx + 50 - 1].time, value: val })),
      ema200: ema200Raw.map((val, idx) => ({ time: data[idx + 200 - 1].time, value: val })),
    };
  }, [data]);

  return { rsiData, macdData, emaData };
};
