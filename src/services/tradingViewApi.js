import axios from 'axios';

const API_CONFIG = {
  baseURL: 'https://tradingview18.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': '994ffb9ce3msh77ac03ab7a280e8p1ffa83jsn4dcd54dc9b37',
    'x-rapidapi-host': 'tradingview18.p.rapidapi.com'
  }
};

export const searchStockSymbols = async (query) => {
  try {
    const options = {
      method: 'GET',
      url: `${API_CONFIG.baseURL}/symbols/auto-complete`,
      params: { query },
      headers: API_CONFIG.headers
    };

    const response = await axios.request(options);
    console.log('Search API Response:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error searching stock symbols:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

export const getStockQuote = async (symbol) => {
  try {
    const options = {
      method: 'GET',
      url: `${API_CONFIG.baseURL}/symbols/get-quote`,
      params: { symbol },
      headers: API_CONFIG.headers
    };

    const response = await axios.request(options);
    console.log('Quote API Response:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error getting stock quote:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

export const getStockProfile = async (symbol) => {
  try {
    const options = {
      method: 'GET',
      url: `${API_CONFIG.baseURL}/symbols/get-profile`,
      params: { symbol },
      headers: API_CONFIG.headers
    };

    const response = await axios.request(options);
    console.log('Profile API Response:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error getting stock profile:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

export const getStockFinancials = async (symbol) => {
  try {
    const options = {
      method: 'GET',
      url: `${API_CONFIG.baseURL}/symbols/get-financials`,
      params: { symbol },
      headers: API_CONFIG.headers
    };

    const response = await axios.request(options);
    console.log('Financials API Response:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error getting stock financials:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

export const getComprehensiveStockData = async (symbol) => {
  try {
    console.log(`Fetching comprehensive data for: ${symbol}`);
    
    const [quoteResult, profileResult, financialsResult] = await Promise.allSettled([
      getStockQuote(symbol),
      getStockProfile(symbol),
      getStockFinancials(symbol)
    ]);

    const result = {
      symbol,
      quote: quoteResult.status === 'fulfilled' ? quoteResult.value : null,
      profile: profileResult.status === 'fulfilled' ? profileResult.value : null,
      financials: financialsResult.status === 'fulfilled' ? financialsResult.value : null,
      timestamp: new Date().toISOString()
    };

    console.log('Comprehensive Stock Data:', result);
    return result;
  } catch (error) {
    console.error('Error getting comprehensive stock data:', error);
    return {
      symbol,
      quote: null,
      profile: null,
      financials: null,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export const formatStockData = (apiData) => {
  if (!apiData || !apiData.symbols) return [];
  
  return apiData.symbols.map(stock => ({
    symbol: stock.symbol || 'N/A',
    name: stock.description || stock.symbol || 'Unknown',
    exchange: stock.exchange || 'N/A',
    type: stock.type || 'stock',
    currency: stock.currency_code || 'USD',
    fullData: stock 
  }));
};

export const formatComprehensiveData = (data) => {
  if (!data) return null;

  const quote = data.quote?.data;
  const profile = data.profile?.data;
  const financials = data.financials?.data;

  return {
    symbol: data.symbol,
    name: profile?.name || quote?.name || data.symbol,
    price: quote?.price || quote?.last || 0,
    change: quote?.change || 0,
    changePercent: quote?.changePercent || quote?.change_percent || 0,
    volume: quote?.volume || 'N/A',
    marketCap: quote?.market_cap || profile?.market_cap || 'N/A',
    sector: profile?.sector || 'N/A',
    industry: profile?.industry || 'N/A',
    description: profile?.description || 'N/A',
    website: profile?.website || 'N/A',
    employees: profile?.employees || 'N/A',
    headquarters: profile?.headquarters || 'N/A',
    founded: profile?.founded || 'N/A',
    logo: '📈', 
    rawData: {
      quote,
      profile,
      financials
    }
  };
};