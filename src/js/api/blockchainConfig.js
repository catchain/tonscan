/* eslint camelcase: "off" */
import axios from 'axios';
import { BLOCKCHAIN_CONFIG_ENDPOINT } from '~/config.js';

const http = axios.create({
    baseURL: BLOCKCHAIN_CONFIG_ENDPOINT,
});

/**
 * @return {Promise<Array>}
 */
export async function getAllConfigParams() {
    const { data } = await http.get('/params');

    return data;
}
