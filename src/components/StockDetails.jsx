import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Globe, 
  Users, 
  Calendar,
  DollarSign,
  BarChart3,
  Info,
  Loader2
} from 'lucide-react';
import { getComprehensiveStockData, formatComprehensiveData } from '../services/tradingViewApi';

const StockDetails = ({ symbol, onClose }) => {
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (symbol) {
      fetchStockDetails();
    }
  }, [symbol]);

  const fetchStockDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getComprehensiveStockData(symbol);
      const formattedData = formatComprehensiveData(data);
      setStockData(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num || num === 'N/A') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatLargeNumber = (num) => {
    if (!num || num === 'N/A') return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${formatNumber(num)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
          <span className="text-gray-600">Loading stock details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-2">Error loading stock details</div>
          <div className="text-sm text-gray-500">{error}</div>
          <button
            onClick={fetchStockDetails}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12 text-gray-500">
          Select a stock to view detailed information
        </div>
      </div>
    );
  }

  const isPositive = stockData.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{stockData.logo}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{stockData.symbol}</h2>
            <p className="text-gray-600">{stockData.name}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        )}
      </div>

      {/* Price Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Current Price</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${formatNumber(stockData.price)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium text-gray-700">Change</span>
          </div>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{formatNumber(stockData.change)}
          </div>
          <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            ({isPositive ? '+' : ''}{formatNumber(stockData.changePercent)}%)
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Volume</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stockData.volume !== 'N/A' ? formatLargeNumber(stockData.volume) : 'N/A'}
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-blue-600" />
          Company Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Market Cap</span>
              <div className="text-lg font-semibold text-gray-900">
                {formatLargeNumber(stockData.marketCap)}
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Sector</span>
              <div className="text-lg font-semibold text-gray-900">{stockData.sector}</div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Industry</span>
              <div className="text-lg font-semibold text-gray-900">{stockData.industry}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Employees
              </span>
              <div className="text-lg font-semibold text-gray-900">
                {stockData.employees !== 'N/A' ? formatLargeNumber(stockData.employees).replace('$', '') : 'N/A'}
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Founded
              </span>
              <div className="text-lg font-semibold text-gray-900">{stockData.founded}</div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Headquarters</span>
              <div className="text-lg font-semibold text-gray-900">{stockData.headquarters}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        {stockData.description !== 'N/A' && (
          <div>
            <span className="text-sm font-medium text-gray-500 flex items-center mb-2">
              <Info className="w-4 h-4 mr-1" />
              Description
            </span>
            <div className="text-sm text-gray-700 leading-relaxed">
              {stockData.description}
            </div>
          </div>
        )}

        {/* Website */}
        {stockData.website !== 'N/A' && (
          <div>
            <span className="text-sm font-medium text-gray-500 flex items-center mb-2">
              <Globe className="w-4 h-4 mr-1" />
              Website
            </span>
            <a
              href={stockData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {stockData.website}
            </a>
          </div>
        )}
      </div>

      {/* Raw Data Debug (for development) */}
      <details className="mt-6">
        <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
          View Raw API Data (Debug)
        </summary>
        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
          {JSON.stringify(stockData.rawData, null, 2)}
        </pre>
      </details>
    </motion.div>
  );
};

export default StockDetails;