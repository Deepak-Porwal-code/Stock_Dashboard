import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import StockList from './components/StockList';
import StockChart from './components/StockChart';
import MarketOverview from './components/MarketOverview';
import NewsPanel from './components/NewsPanel';
import StockDetails from './components/StockDetails';
import { stockCompanies } from './data/stockData';

function App() {
  const [selectedStock, setSelectedStock] = useState(stockCompanies[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailedStockSymbol, setDetailedStockSymbol] = useState(null);
  const [showStockDetails, setShowStockDetails] = useState(false);


  const handleStockDetails = (stockData) => {
    setDetailedStockSymbol(stockData.symbol);
    setShowStockDetails(true);
  };

  const closeStockDetails = () => {
    setShowStockDetails(false);
    setDetailedStockSymbol(null);
  };

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Stock Market Dashboard</h2>
          <p className="text-gray-500">Loading market data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">

        {/* Stock Details Modal/Panel */}
        {showStockDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StockDetails
              symbol={detailedStockSymbol}
              onClose={closeStockDetails}
            />
          </motion.div>
        )}

        {/* Market Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <MarketOverview />
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stock List - Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <StockList
              stocks={stockCompanies}
              selectedStock={selectedStock}
              onSelectStock={setSelectedStock}
            />
          </motion.div>

          {/* Chart Area - Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <StockChart selectedStock={selectedStock} />
          </motion.div>

          {/* News Panel - Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <NewsPanel selectedStock={selectedStock} />
          </motion.div>
        </div>

        {/* Additional Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Portfolio Value</h3>
            <div className="text-3xl font-bold text-blue-600">$124,567.89</div>
            <div className="text-sm text-green-600 mt-1">+2.34% Today</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Day's Gain/Loss</h3>
            <div className="text-3xl font-bold text-green-600">+$2,891.23</div>
            <div className="text-sm text-gray-500 mt-1">+2.38% Change</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Total Return</h3>
            <div className="text-3xl font-bold text-green-600">+$18,432.11</div>
            <div className="text-sm text-gray-500 mt-1">+17.35% All Time</div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 Stock Market Dashboard. Market data is simulated for demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;