'use client';

import React, { useState, useEffect } from 'react';
import { TVChart } from '@/components/Chart/TVChart';
import Link from 'next/link';

export default function DirectPage() {
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [botStatus, setBotStatus] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);

  useEffect(() => {
    const fetchBotData = async () => {
      try {
        const [statusRes, balanceRes] = await Promise.all([
          fetch('http://localhost:3001/freqtrade/ping'),
          fetch('http://localhost:3001/freqtrade/balance')
        ]);
        
        const statusData = await statusRes.json();
        const balanceData = await balanceRes.json();
        
        setBotStatus(statusData);
        setBalance(balanceData);
      } catch (err) {
        console.error("Failed to fetch bot data", err);
      }
    };

    fetchBotData();
    const interval = setInterval(fetchBotData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-[#0B0E14] text-white">
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-sm">
        
        {/* Header & Status Bar */}
        <div className="flex justify-between items-center mb-8 bg-gray-900/50 backdrop-blur-md p-4 rounded-2xl border border-gray-800">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Freqtrade Terminal
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className={`w-2 h-2 rounded-full ${botStatus?.status === 'pong' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400">
                Bot Status: {botStatus?.status === 'pong' ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Balance</p>
              <p className="text-sm font-semibold text-emerald-400">
                {balance?.total ? `${balance.total.toFixed(2)} USDT` : '---'}
              </p>
            </div>
            <Link href="/">
              <button className="px-4 py-2 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm font-medium transition-colors">
                Main Widget 📈
              </button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Main Chart Area */}
          <div className="col-span-12 lg:col-span-9 bg-gray-900/50 backdrop-blur-md p-4 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <select 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="LINK/USDT">LINK/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                </select>
                
                <div className="flex bg-gray-800 rounded-lg p-1">
                  {['1m', '5m', '15m', '1h', '4h', '1d'].map(tf => (
                    <button 
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${timeframe === tf ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* The TVChart Component */}
            <TVChart symbol={symbol} timeframe={timeframe} />
            
          </div>
          
          {/* Side Panel */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="text-blue-400">📊</span> Indicators
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">RSI (14)</span>
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-0" />
                </label>
                
                <label className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">MACD</span>
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-0" />
                </label>
                
                <label className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">EMA (200)</span>
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-0" />
                </label>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="text-emerald-400">🤖</span> Bot Markers
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Show Executions</span>
                  <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-700 bg-gray-800 focus:ring-0" />
                </label>
                <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <p className="text-[10px] text-gray-500 mb-1">PRO TIP</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Markers are pulled every 30s from your local Freqtrade REST API.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
