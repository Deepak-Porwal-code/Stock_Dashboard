import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { marketIndices } from '../data/stockData';

const MarketOverview = () => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatChange = (change, changePercent) => {
    const isPositive = change >= 0;
    const sign = isPositive ? '+' : '';
    return {
      change: `${sign}${formatNumber(change)}`,
      changePercent: `${sign}${formatNumber(changePercent)}%`,
      isPositive
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketIndices.map((index, i) => {
          const { change, changePercent, isPositive } = formatChange(index.change, index.changePercent);
          
          return (
            <motion.div
              key={index.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{index.name}</h3>
                <span className="text-xs text-gray-500 font-mono">{index.symbol}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(index.value)}
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{change}</span>
                    <span>({changePercent})</span>
                  </div>
                </div>
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isPositive ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isPositive ? (
                    <TrendingUp className={`w-6 h-6 text-green-600`} />
                  ) : (
                    <TrendingDown className={`w-6 h-6 text-red-600`} />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Market Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-500 mb-1">Volume</div>
            <div className="text-lg font-semibold text-gray-900">2.4B</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Advancers</div>
            <div className="text-lg font-semibold text-green-600">1,847</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Decliners</div>
            <div className="text-lg font-semibold text-red-600">1,234</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Unchanged</div>
            <div className="text-lg font-semibold text-gray-600">419</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;