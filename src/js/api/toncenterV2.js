import axios from 'axios';
import { TONCENTER_V2_API_ENDPOINT, TONCENTER_API_KEY } from '~/config.js';
import { hexToBase64 } from '~/utils.js';
import { canonizeAddress } from '~/tonweb.js';

// Disable headers if api key is not set. Otherwise
// axios will make a pre-flight request:
const httpHeaders = TONCENTER_API_KEY
    ? { 'X-API-Key': TONCENTER_API_KEY }
    : undefined;

const http = axios.create({
    baseURL: TONCENTER_V2_API_ENDPOINT,
    headers: httpHeaders,
});

/**
 * This function returns last blocks sorted by time.
 *
 * @param  {Numer} options.wc
 * @param  {Number} options.limit
 * @param  {Number} options.offset
 * @param  {Number} options.startUtime
 * @param  {Number} options.endUtime
 * @return {Promise<Array>}
 */
export const getPreviousBlocks = async function ({ wc, limit, offset, startUtime, endUtime }) {
    const { data: result } = await http.get('v1/blocks', {
        params: {
            workchain: wc,
            limit: limit || 1,
            offset: offset,
            start_utime: startUtime,
            end_utime: endUtime,
            sort: 'desc',
        },
    });

    result.forEach((block) => {
        block.root_hash_hex = block.root_hash;
        block.root_hash = hexToBase64(block.root_hash);
    });

    return result.map(Object.freeze);
};

const getSourceAndDestination = function (msg, address, hash) {
    const from = msg.source ? canonizeAddress(msg.source) : null;
    const to = msg.destination ? canonizeAddress(msg.destination) : null;

    return {
        from, to,
        is_out: address === from,
        amount: msg.value || null,
        created_at: msg.created_at,
        hash: hexToBase64(hash),
    };
};

/**
 * @param  {Number} options.wc
 * @param  {Number} options.startUtime
 * @param  {Number} options.endUtime
 * @return {Promise<Array>}
 */
export const getAllTransactions = async function ({ wc, limit, startUtime, endUtime } = {}) {
    const { data: result } = await http.get('v1/transactions', {
        params: {
            workchain: wc,
            limit: limit,
            start_utime: startUtime,
            end_utime: endUtime,
            sort: 'desc',
        },
    });

    const transactions = result.map((tx) => {
        const address = tx.account;
        const hash = tx.hash;

        const is_service = !tx.in_msg && tx.out_msgs.length === 0;
        const is_external = tx.out_msgs.length == 0 && !tx.in_msg?.source && tx.in_msg?.destination == address;
        let msg = undefined;

        if (is_service) {
            msg = {
                source: address,
                destination: null,
                created_at: tx.created_at || tx.now,
            };

        } else if (tx.out_msgs.length > 0) {
            msg = tx.out_msgs.at(-1);

        } else {
            msg = tx.in_msg;
        }

        const sourceAndDestination = getSourceAndDestination(msg, address, hash);

        sourceAndDestination.is_service = is_service;
        sourceAndDestination.is_external = is_external;
        sourceAndDestination.created_at = tx.now;

        return sourceAndDestination;
    });

    return transactions.sort((a, b) => b.created_at - a.created_at).map(Object.freeze);
};
