import axios from 'axios';
import { TYPESENSE_API_KEY, TYPESENSE_API_ENDPOINT } from '~/config.js';

const http = axios.create({
    baseURL: TYPESENSE_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use((config) => {
    if (config.method === 'post') {
        config.headers['x-typesense-api-key'] = TYPESENSE_API_KEY;

    } else if (config.method === 'get') {
        config.params['x-typesense-api-key'] = TYPESENSE_API_KEY;
    }

    return config;
});

/**
 * @param  {String} indice
 * @param  {Object} params
 * @return {Promise<Object>}
 */
export const search = function(indice, params) {
    return http.get(`/collections/${indice}/documents/search`, { params }).then(({ data }) => data);
};

/**
 * @param  {Array<Object>} searches
 * @return {Array}
 */
export const multisearch = function(searches) {
    const params = { q: searches[0].q }; // add query param for analytics
    return http.post('multi_search', { searches }, { params }).then(response => response.data.results);
};

/**
 * @param  {String} query
 * @param  {Object} params
 * @return {Promise<Object>}
 */
export const searchAddress = async function(query, params = {}) {
    // leave only domain names without the to-level domain:
    params.q = query.split('.')[0];

    const searches = [{
        collection: 'addresses',
        query_by: 'address,name,keywords',
        ...params,
    }, {
        collection: 'domains',
        query_by: 'domain',
        exclude_fields: 'id',
        ...params,
    }];

    const results = await multisearch(searches);

    return Object.freeze({
        addresses: results[0].hits,
        domains: results[1].hits,
    });
};
