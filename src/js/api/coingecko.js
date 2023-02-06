import axios from 'axios';
import { COINGECKO_ENDPOINT } from '~/config.js';

const http = axios.create({
    baseURL: COINGECKO_ENDPOINT,
});

/**
 * @param  {String} currency
 * @return {Promise<Array[Number, Number]>}
 */
export const getExchangeRateAndTrend = async function(currency) {
    const params = {
        vs_currency: currency.toUpperCase(),
        interval: 'daily',
        days: 2,
    };

    const { data } = await http.get(`${COINGECKO_ENDPOINT}/coins/the-open-network/market_chart`, { params });

    const oldest = data.prices.shift()[1];
    const newest = data.prices.pop()[1];
    const trend = newest >= oldest ? 1 : -1;

    return [ newest, trend ];
};
