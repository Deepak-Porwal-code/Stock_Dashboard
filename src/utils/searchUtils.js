import Fuse from 'fuse.js';
import { stockCompanies } from '../data/stockData';

const fuseOptions = {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  keys: [
    { name: 'symbol', weight: 0.4 },
    { name: 'name', weight: 0.3 },
    { name: 'sector', weight: 0.2 },
    { name: 'keywords', weight: 0.1 }
  ]
};


const enhancedStockData = stockCompanies.map(stock => ({
  ...stock,
  keywords: [
    stock.name.toLowerCase(),
    stock.symbol.toLowerCase(),
    stock.sector.toLowerCase(),
    ...stock.name.toLowerCase().split(' '),
    ...getRelatedKeywords(stock.name, stock.symbol)
  ].filter(Boolean)
}));


function getRelatedKeywords(name, symbol) {
  const keywords = [];
  

  if (name.includes('Inc')) keywords.push('incorporated');
  if (name.includes('Corp')) keywords.push('corporation');
  if (name.includes('Ltd')) keywords.push('limited');
  

  if (symbol.length > 1) {
    keywords.push(symbol.toLowerCase());
    keywords.push(symbol.substring(0, 2).toLowerCase());
  }
  
  return keywords;
}

const fuse = new Fuse(enhancedStockData, fuseOptions);

export const enhancedSearch = (query, limit = 10) => {
  if (!query || query.trim().length === 0) {
    return getPopularStocks(limit);
  }

  const searchTerm = query.trim().toLowerCase();
  
  const exactMatches = enhancedStockData.filter(stock => 
    stock.symbol.toLowerCase() === searchTerm ||
    stock.name.toLowerCase().includes(searchTerm)
  );

  const fuzzyResults = fuse.search(searchTerm);
  const fuzzyMatches = fuzzyResults.map(result => result.item);

  const combinedResults = [...exactMatches, ...fuzzyMatches];
  const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.symbol, item])).values());

  return uniqueResults.slice(0, limit);
};

export const getPopularStocks = (limit = 5) => {
  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META'];
  return enhancedStockData
    .filter(stock => popularStocks.includes(stock.symbol))
    .slice(0, limit);
};

export const getTrendingSearches = () => {
  return [
    { symbol: 'NVDA', name: 'NVIDIA Corporation', reason: 'AI Boom' },
    { symbol: 'TSLA', name: 'Tesla Inc.', reason: 'EV Growth' },
    { symbol: 'AAPL', name: 'Apple Inc.', reason: 'iPhone 15 Launch' }
  ];
};

export const getSearchSuggestions = (query) => {
  if (!query || query.length < 2) return [];

  const results = enhancedSearch(query, 5);
  return results.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    logo: stock.logo
  }));
};

export const searchWithFilters = (query, filters = {}) => {
  let results = enhancedSearch(query);

  if (filters.sector) {
    results = results.filter(stock => 
      stock.sector.toLowerCase().includes(filters.sector.toLowerCase())
    );
  }

  if (filters.minPrice) {
    results = results.filter(stock => stock.price >= filters.minPrice);
  }

  if (filters.maxPrice) {
    results = results.filter(stock => stock.price <= filters.maxPrice);
  }

  return results;
};

export const getSearchRecommendations = (recentSearches = []) => {
  if (recentSearches.length === 0) {
    return getPopularStocks(3);
  }

  const relatedStocks = [];
  recentSearches.forEach(symbol => {
    const stock = enhancedStockData.find(s => s.symbol === symbol);
    if (stock) {
      const sectorMates = enhancedStockData.filter(s => 
        s.sector === stock.sector && s.symbol !== symbol
      );
      relatedStocks.push(...sectorMates);
    }
  });

  return Array.from(new Map(relatedStocks.map(item => [item.symbol, item])).values())
    .slice(0, 5);
};
