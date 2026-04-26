'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Import TradingView widget dynamically to avoid SSR issues
const AdvancedRealTimeChart = dynamic(
  () => import('react-ts-tradingview-widgets').then((w) => w.AdvancedRealTimeChart),
  { ssr: false }
);

export default function MainPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0B0E14] text-white">
      {/* Top Navigation Bar */}
      <div className="w-full bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Trading System
        </h1>
        <div className="flex gap-4">
          <span className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-lg text-sm font-medium">
            Official Widget
          </span>
          <Link href="/direct">
            <button className="px-4 py-2 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm font-medium transition-colors">
              Go to Direct Chart ⚡
            </button>
          </Link>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full flex-grow" style={{ height: 'calc(100vh - 70px)' }}>
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
