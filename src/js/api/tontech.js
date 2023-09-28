import axios from 'axios';
import { TONTECH_API_ENDPOINT } from '~/config.js';
import { parseCsv } from '~/utils.js';

const http = axios.create({
    baseURL: TONTECH_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * @return {Promise<Object>}
 */
export const getStatus = function() {
    return http.get(`/status`).then(({ data }) => data);
};

/**
 * @return {Promise<Object>}
 */
export const getStakingInformation = function() {
    return http.get(`/yield`).then(({ data }) => data.map((item) => ({ ...item, date: item.date.replace('Z', '')})).slice(-340));
};

/**
 * @return {Promise<Object>}
 */
export const getSuspendedAddresses = function() {
    return http.get(`/early_miners`).then(({ data }) => parseCsv(data));
};
