import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { searchStockSymbols } from '../services/tradingViewApi';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runApiTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test with Tesla as example
      const result = await searchStockSymbols('TSLA');
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        data: null
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">TradingView API Test</h3>
      
      <button
        onClick={runApiTest}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <Play className="w-4 h-4" />
        <span>{isLoading ? 'Testing...' : 'Test API'}</span>
      </button>

      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg border"
        >
          <div className="flex items-center space-x-2 mb-2">
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.success ? 'API Test Successful!' : 'API Test Failed'}
            </span>
          </div>

          {testResult.success ? (
            <div className="text-sm text-gray-600">
              <p className="mb-2">Found {testResult.data?.symbols?.length || 0} results for "TSLA"</p>
              {testResult.data?.symbols?.slice(0, 3).map((symbol, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded mb-1">
                  <strong>{symbol.symbol}</strong> - {symbol.description}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-red-600">
              Error: {testResult.error}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ApiTest;