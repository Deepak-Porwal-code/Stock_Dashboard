import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Star } from 'lucide-react';

const StockList = ({ stocks, selectedStock, onSelectStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(['AAPL', 'TSLA', 'NVDA']);

  const filteredStocks = stocks.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const toggleFavorite = (symbol, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Stocks</h2>
        <span className="text-sm text-gray-500">{filteredStocks.length} companies</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
        />
      </div>

      {/* Stock List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredStocks.map((stock, index) => {
          const { change, changePercent, isPositive } = formatChange(stock.change, stock.changePercent);
          const isSelected = selectedStock?.symbol === stock.symbol;
          const isFavorite = favorites.includes(stock.symbol);

          return (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelectStock(stock)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{stock.logo}</div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{stock.symbol}</div>
                    <div className="text-xs text-gray-500 truncate max-w-24">{stock.name}</div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => toggleFavorite(stock.symbol, e)}
                  className={`p-1 rounded transition-colors duration-200 ${
                    isFavorite 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900">
                  ${formatNumber(stock.price)}
                </div>
                
                <div className={`flex items-center space-x-1 text-xs font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{changePercent}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Vol: {stock.volume}</span>
                <span>Cap: {stock.marketCap}</span>
              </div>

              {/* Sector Tag */}
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                  {stock.sector}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
            Favorites
          </h3>
          <div className="flex flex-wrap gap-1">
            {favorites.map(symbol => (
              <button
                key={symbol}
                onClick={() => {
                  const stock = stocks.find(s => s.symbol === symbol);
                  if (stock) onSelectStock(stock);
                }}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockList;