import axios from 'axios';
import Asset from '../models/Asset';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const SYMBOLS = ['bitcoin', 'ethereum', 'litecoin','ripple','cardano'];

const fetchAssetPrices = async () => {
  try {
    const { data } = await axios.get(API_URL, {
      params: {
        ids: SYMBOLS.join(','),
        vs_currencies: 'usd'
      }
    });
    const assets = SYMBOLS.map(symbol => ({
      symbol,
      price: data[symbol].usd,
      timestamp: new Date()
    }));

    await Asset.insertMany(assets);
    console.log('Data fetched and saved:', assets);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching data:', error.message);
    } else {
      console.error('Unknown error fetching data:', error);
    }
  }
};

const startPolling = (interval = 10000, maxRetries = 5) => {
  const poll = async (retries = 0) => {
    try {
      await fetchAssetPrices();
      setTimeout(() => poll(0), interval);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429 && retries < maxRetries) {
          const retryAfter = (2 ** retries) * 1000;
          console.log(`Rate limit exceeded. Retrying in ${retryAfter / 1000} seconds...`);
          setTimeout(() => poll(retries + 1), retryAfter);
        } else {
          console.error('Max retries reached or other Axios error. Stopping polling.');
        }
      } else {
        console.error('Unknown error occurred. Stopping polling.', error);
      }
    }
  };

  poll();
};

export { startPolling };
