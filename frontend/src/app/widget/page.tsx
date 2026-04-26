'use client';

import dynamic from 'next/dynamic';

// Import TradingView widget dynamically to avoid SSR issues
const AdvancedRealTimeChart = dynamic(
  () => import('react-ts-tradingview-widgets').then((w) => w.AdvancedRealTimeChart),
  { ssr: false }
);

export default function WidgetPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 bg-[#0B0E14] text-white">
      <div className="w-full h-screen">
        <AdvancedRealTimeChart 
          theme="dark" 
          symbol="BINANCE:BTCUSDT"
          interval="60"
          timezone="Etc/UTC"
          style="1"
          locale="en"
          enable_publishing={false}
          hide_side_toolbar={false}
          allow_symbol_change={true}
          autosize
        />
      </div>
    </main>
  );
}
