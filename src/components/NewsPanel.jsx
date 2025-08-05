import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Clock, ExternalLink, Filter } from 'lucide-react';
import { stockNews } from '../data/stockData';

const NewsPanel = ({ selectedStock }) => {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filteredNews = stockNews;
      
      if (filter === 'selected' && selectedStock) {
        filteredNews = stockNews.filter(item => item.symbol === selectedStock.symbol);
      }
      
      setNews(filteredNews);
      setIsLoading(false);
    }, 300);
  }, [selectedStock, filter]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - time) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getStockColor = (symbol) => {
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Market News</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All News</option>
            <option value="selected">
              {selectedStock ? `${selectedStock.symbol} Only` : 'Selected Stock'}
            </option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {news.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Newspaper className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No news available</p>
              {filter === 'selected' && selectedStock && (
                <p className="text-sm mt-2">No news found for {selectedStock.symbol}</p>
              )}
            </div>
          ) : (
            news.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStockColor(item.symbol)}`}>
                    {item.symbol}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{item.source}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-xs">
            View All News
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-xs">
            Set Alerts
          </button>
        </div>
      </div>

      {/* Market Sentiment */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Market Sentiment</span>
          <span className="text-xs text-gray-500">Last 24h</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
          <span className="text-sm font-medium text-green-600">68% Bullish</span>
        </div>
      </div>
    </div>
  );
};

export default NewsPanel;