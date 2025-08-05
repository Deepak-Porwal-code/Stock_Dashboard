import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, TrendingUp, ExternalLink, Info } from 'lucide-react';
import { searchStockSymbols, formatStockData, getComprehensiveStockData } from '../services/tradingViewApi';

const StockSearch = ({ onStockSelect, onStockDetails }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(null);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    const response = await searchStockSymbols(searchQuery);
    
    if (response.success) {
      const formattedData = formatStockData(response.data);
      setResults(formattedData.slice(0, 10)); 
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    setTimeout(() => {
      if (value === query) {
        handleSearch(value);
      }
    }, 500);
  };

  const handleStockClick = (stock) => {
    if (onStockSelect) {
      onStockSelect(stock);
    }
    setQuery('');
    setShowResults(false);
    setResults([]);
  };

  const handleGetDetails = async (stock, e) => {
    e.stopPropagation();
    setLoadingDetails(stock.symbol);
    
    try {
      const detailedData = await getComprehensiveStockData(stock.symbol);
      if (onStockDetails) {
        onStockDetails(detailedData);
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
    } finally {
      setLoadingDetails(null);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Stock Search
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for stocks (e.g., AAPL, Tesla, Microsoft)..."
            value={query}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>

        {/* Search Results */}
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          >
            {results.map((stock, index) => (
              <motion.div
                key={`${stock.symbol}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleStockClick(stock)}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-gray-900">{stock.symbol}</div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {stock.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">{stock.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stock.exchange} • {stock.currency}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleGetDetails(stock, e)}
                      disabled={loadingDetails === stock.symbol}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Get detailed information"
                    >
                      {loadingDetails === stock.symbol ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </button>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {showResults && results.length === 0 && !isLoading && query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
          >
            <div className="text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No stocks found for "{query}"</p>
              <p className="text-xs mt-1">Try searching with different keywords</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StockSearch;