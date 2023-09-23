import { TONAPI_ENDPOINT } from '~/config.js';
import { canonizeAddress } from '~/tonweb.js';
import axios from 'axios';

const http = axios.create({
    baseURL: TONAPI_ENDPOINT,
});

/**
 * @param  {String} address
 * @return {Promise<Array>}
 */
export const getJettonBalances = async function(address) {
    const response = await http.get(`accounts/${address}/jettons`);

    return (response.data.balances || []).map(( balance ) => Object.freeze({
        address: canonizeAddress(balance.wallet_address.address),
        balance: balance.balance,
        jetton_address: canonizeAddress(balance.jetton_address),
        jetton_meta: Object.freeze({
            name: balance.metadata?.name,
            description: balance.metadata?.description,
            symbol: balance.metadata?.symbol,
            image_data: null,
            decimals: balance.metadata?.decimals,
            image: Object.freeze({
                w72: balance.metadata?.image,
                w144: balance.metadata?.image,
                w216: balance.metadata?.image,
            }),
        }),
    }));
};

export const getAccount = async function(address) {
    const response = await http.get(`accounts/${address}`);

    return response.data;
}
