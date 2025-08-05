import React from 'react';
import { MarketData as MarketDataType } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, Globe } from 'lucide-react';

interface MarketDataProps {
  marketData: MarketDataType[];
  onRefresh: () => void;
  isLoading: boolean;
}

const MarketData: React.FC<MarketDataProps> = ({ marketData, onRefresh, isLoading }) => {
  const groupedData = marketData.reduce((acc, data) => {
    if (!acc[data.symbol]) acc[data.symbol] = [];
    acc[data.symbol].push(data);
    return acc;
  }, {} as Record<string, MarketDataType[]>);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Globe className="w-6 h-6 text-indigo-600" />
          <span>Multi-Chain Market Data</span>
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(groupedData).map(([symbol, data]) => {
          const avgPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length;
          const avgChange = data.reduce((sum, d) => sum + d.change24h, 0) / data.length;
          const totalVolume = data.reduce((sum, d) => sum + d.volume, 0);

          return (
            <div key={symbol} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{symbol}</h3>
                <div className={`flex items-center space-x-1 ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {avgChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{avgChange.toFixed(2)}%</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Price:</span>
                  <span className="font-semibold">${avgPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-semibold">${(totalVolume / 1000000).toFixed(2)}M</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 mb-2">Available on:</p>
                {data.map((chainData, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded-full capitalize">
                      {chainData.chain}
                    </span>
                    <span className="font-medium">${chainData.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {marketData.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No market data available. Click refresh to load data.</p>
        </div>
      )}
    </div>
  );
};

export default MarketData;