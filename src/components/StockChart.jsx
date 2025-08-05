import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Calendar, BarChart3, Activity } from 'lucide-react';
import { generateHistoricalData, generateIntradayData } from '../data/stockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ selectedStock }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const timeframes = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' }
  ];

  useEffect(() => {
    if (selectedStock) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        let data;
        let labels;
        
        if (timeframe === '1D') {
          data = generateIntradayData(selectedStock.symbol, 24);
          labels = data.map(d => d.time);
        } else {
          const days = timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
          data = generateHistoricalData(selectedStock.symbol, days);
          labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }));
        }

        const prices = data.map(d => d.price);
        const isPositive = prices[prices.length - 1] >= prices[0];

        setChartData({
          labels,
          datasets: [
            {
              label: selectedStock.symbol,
              data: prices,
              borderColor: isPositive ? '#22c55e' : '#ef4444',
              backgroundColor: isPositive 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: isPositive ? '#22c55e' : '#ef4444',
              pointHoverBorderColor: '#ffffff',
              pointHoverBorderWidth: 2,
            }
          ]
        });
        
        setIsLoading(false);
      }, 500);
    }
  }, [selectedStock, timeframe]);

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `${selectedStock.symbol}: $${formatNumber(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + formatNumber(value);
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  if (!selectedStock) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center h-96">
        <div className="text-center text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Select a stock to view its chart</p>
        </div>
      </div>
    );
  }

  const { change, changePercent, isPositive } = formatChange(selectedStock.change, selectedStock.changePercent);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Stock Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{selectedStock.logo}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedStock.symbol}</h2>
            <p className="text-gray-600">{selectedStock.name}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            ${formatNumber(selectedStock.price)}
          </div>
          <div className={`flex items-center justify-end space-x-1 text-lg font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span>{change}</span>
            <span>({changePercent})</span>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Price Chart</span>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                timeframe === tf.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-80">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading chart data...</p>
            </div>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No chart data available</p>
          </div>
        )}
      </div>

      {/* Stock Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Market Cap</div>
            <div className="text-lg font-semibold text-gray-900">{selectedStock.marketCap}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Volume</div>
            <div className="text-lg font-semibold text-gray-900">{selectedStock.volume}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Sector</div>
            <div className="text-lg font-semibold text-gray-900">{selectedStock.sector}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">P/E Ratio</div>
            <div className="text-lg font-semibold text-gray-900">24.5</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;