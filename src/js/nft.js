import axios from 'axios';
import { NFT_API_ENDPOINT } from '~/config.js';

const http = axios.create({
    baseURL: NFT_API_ENDPOINT,
});

export const checkAddress = function(address) {
    return http.get(`address/${address}`).then(({ data }) => data);
};

export const getNftCollectionItems = function(address, options) {
    const { limit, offset } = options;
    const params = {
        limit: limit || 12,
        offset: offset || 0,
    };

    return http.get(`collection/${address}/items`, { params }).then(({ data }) => data);
};
