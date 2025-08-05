export const stockCompanies = [
  {
    id: 'AAPL',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.52,
    change: 2.34,
    changePercent: 1.30,
    marketCap: '2.85T',
    volume: '45.2M',
    logo: '🍎',
    sector: 'Technology'
  },
  {
    id: 'GOOGL',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: -1.45,
    changePercent: -1.04,
    marketCap: '1.75T',
    volume: '28.7M',
    logo: '🔍',
    sector: 'Technology'
  },
  {
    id: 'MSFT',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.12,
    changePercent: 1.10,
    marketCap: '2.81T',
    volume: '22.1M',
    logo: '🪟',
    sector: 'Technology'
  },
  {
    id: 'AMZN',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 151.94,
    change: -2.18,
    changePercent: -1.41,
    marketCap: '1.58T',
    volume: '35.8M',
    logo: '📦',
    sector: 'Consumer Discretionary'
  },
  {
    id: 'TSLA',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    change: 8.73,
    changePercent: 3.64,
    marketCap: '789.2B',
    volume: '89.4M',
    logo: '⚡',
    sector: 'Consumer Discretionary'
  },
  {
    id: 'NVDA',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: 15.67,
    changePercent: 1.82,
    marketCap: '2.16T',
    volume: '41.3M',
    logo: '🎮',
    sector: 'Technology'
  },
  {
    id: 'META',
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 484.20,
    change: -3.45,
    changePercent: -0.71,
    marketCap: '1.23T',
    volume: '18.9M',
    logo: '📘',
    sector: 'Communication Services'
  },
  {
    id: 'NFLX',
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 487.83,
    change: 12.45,
    changePercent: 2.62,
    marketCap: '216.8B',
    volume: '3.2M',
    logo: '🎬',
    sector: 'Communication Services'
  }
];

// Generate historical price data for charts
export const generateHistoricalData = (symbol, days = 30) => {
  const company = stockCompanies.find(c => c.symbol === symbol);
  if (!company) return [];

  const data = [];
  const basePrice = company.price;
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 0.1; 
    const dayVariation = Math.sin(i * 0.1) * 0.05; 
    const price = basePrice * (1 + variation + dayVariation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000
    });
  }

  return data;
};

export const generateIntradayData = (symbol, hours = 24) => {
  const company = stockCompanies.find(c => c.symbol === symbol);
  if (!company) return [];

  const data = [];
  const basePrice = company.price;
  const now = new Date();

  for (let i = hours - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    
    const variation = (Math.random() - 0.5) * 0.02; 
    const price = basePrice * (1 + variation);
    
    data.push({
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      timestamp: date.getTime(),
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
  }

  return data;
};

export const marketIndices = [
  {
    name: 'S&P 500',
    symbol: 'SPX',
    value: 4783.35,
    change: 23.87,
    changePercent: 0.50
  },
  {
    name: 'Dow Jones',
    symbol: 'DJI',
    value: 37863.80,
    change: -158.84,
    changePercent: -0.42
  },
  {
    name: 'NASDAQ',
    symbol: 'IXIC',
    value: 14968.78,
    change: 92.34,
    changePercent: 0.62
  }
];

export const stockNews = [
  {
    id: 1,
    title: "Apple Reports Strong Q4 Earnings, iPhone Sales Exceed Expectations",
    summary: "Apple Inc. reported quarterly earnings that beat analyst expectations, driven by strong iPhone 15 sales and services revenue growth.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "MarketWatch",
    symbol: "AAPL"
  },
  {
    id: 2,
    title: "Tesla Announces New Gigafactory in Mexico",
    summary: "Tesla revealed plans for a new manufacturing facility in Mexico, expected to produce next-generation vehicles starting in 2025.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: "Reuters",
    symbol: "TSLA"
  },
  {
    id: 3,
    title: "NVIDIA's AI Chip Demand Continues to Surge",
    summary: "Strong demand for AI processors drives NVIDIA's revenue growth, with data center sales reaching record highs.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: "TechCrunch",
    symbol: "NVDA"
  }
];