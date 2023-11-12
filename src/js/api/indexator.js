import { TONCENTER_INDEX_API_ENDPOINT, TONCENTER_INDEX_API_KEY } from '~/config.js';
import { base64ToBytes, toBase64Web, toBase64Rfc } from '~/utils.js';
import { getAddressTransactions } from './extenderContracts.js'; // TODO
import axios from 'axios';

// Disable headers if api key is not set. Otherwise
// axios will make a pre-flight request:
const httpHeaders = TONCENTER_INDEX_API_KEY
    ? { 'X-API-Key': TONCENTER_INDEX_API_KEY }
    : undefined;

const http = axios.create({
    baseURL: TONCENTER_INDEX_API_ENDPOINT,
    headers: httpHeaders,
});

/**
 * This function extracts the data, that may be unique for every msg:
 * from (source address), to (destination address), comment and amount.
 *
 * @param  {Object} msg
 * @return {Object}
 */
const parseMessageData = function extractMessageDetails(msg) {
    const from = msg.source || null;
    const to = msg.destination || null;

    return { from, to,
        message: msg.comment,
        amount: msg.value,
        op: msg.op ? `0x${(msg.op >>> 0).toString(16)}` : null,
        is_bounced: msg.bounced === true,
        action: msg.action,
        meta: msg.meta,
        destination_type: msg.destination_type,
        source_type: msg.source_type,
        destination_alias: msg.destination_alias,
        source_alias: msg.source_alias,
    };
};

/**
 * @param  {Object} tx
 * @param  {String} address
 * @return {Object}
 */
const prepareTransaction = function(tx, address) {
    // actions are pre-formatted on the backend:
    if (tx.action) {
        return Object.freeze(tx);
    }

    const is_service = !tx.in_msg && tx.out_msgs.length === 0;

    const is_external = tx.out_msgs.length == 0
        && !tx.in_msg?.source
        && tx.in_msg?.destination == address;

    const action_result_code = parseInt(tx.action_result_code === null ? -1 : tx.action_result_code, 10);

    // both phases are skipped if we're activating the new wallet, we should consider this tx successful:
    const new_wallet_tx_success = tx.action_result_code === null && tx.compute_exit_code === null;

    // 0 and 1 are success codes, all other are error codes:
    const is_success = new_wallet_tx_success || (action_result_code === 1 || action_result_code === 0);
    const exit_code = is_success
        ? tx.action_result_code
        : tx.compute_exit_code;

    const txDetails = {
        address: address, 
        hash: toBase64Web(tx.hash),
        output_count: tx.out_msgs.length,
        timestamp: parseInt(tx.utime + '000', 10),
        fee: tx.fee,
        lt: tx.lt,
        exit_code: exit_code || 0,
        messages: [],
    };

    const msgDetails = {
        is_service, is_external, is_success,
        is_aggregated: false,
    };

    // Don't display long message list (e.g. multisends), show aggregated info instead:
    if (tx.out_msgs.length > 10) {
        const aggregatedAmount = tx.out_msgs.reduce((total, outMsg) => parseInt(outMsg.value, 10) + total, 0);
        txDetails.messages.push({ ...msgDetails,
            amount: aggregatedAmount,
            is_aggregated: true,
            is_bounced: tx.out_msgs.some(msg => msg.bounced),
            from: address,
            to: 'multiple destinations', // must be truthy to indicate that we do have the destination
        });

    // Otherwise push out_msgs to the list in chronological (reverse) order:
    } else {
        tx.out_msgs.reverse().forEach((outMsg) => {
            txDetails.messages.push({ ...msgDetails, ...parseMessageData(outMsg) });
        });
    }

    // Then push the input message:
    if (tx.in_msg?.source) {
        txDetails.messages.push({ ...msgDetails, ...parseMessageData(tx.in_msg) });
    }

    // Special case when there're neither out_msgs, nor in_msg (like in system contract):
    if (is_service) {
        txDetails.messages.push({ ...msgDetails,
            from: address,
            to: null,
        });
    }

    // Special case for external messages (e. g. when activating wallet):
    if (is_external) {
        txDetails.messages.push({ ...msgDetails,
            from: null,
            to: address,
        });
    }

    for (let i = 0; i < txDetails.messages.length; i++) {
        Object.freeze(txDetails.messages[i]);
    }

    return Object.freeze(txDetails);
};

/**
 * @param  {String} address
 * @param  {Number} end_utime
 * @param  {Number} limit
 * @return {Promise<Array>}
 */
export const getTransactionsByAddress = async function(address, { limit = 50, offset = 0, end_utime }) {
    const query = { address, end_utime, limit, offset,
        include_msg_body: true,
    };

    const data = await getAddressTransactions(address, query).catch((e) => {
        return http.get('getTransactionsByAddress', { params: query }).then(({ data }) => data);
    });

    return data.map(tx => prepareTransaction(tx, address));
};

/**
 * @param  {String} msg_hash
 * @return {Promise<Object>}
 */
export const getTransactionByInMessageHash = async function(msg_hash) {
    const query = {
        msg_hash: toBase64Rfc(msg_hash),
        include_msg_body: true,
    };

    const { data } = await http.get('getTransactionByInMessageHash', { params: query })
    return data[0];
};

/**
 * @param  {String} tx_hash
 * @return {Promise<Object>}
 */
export const getTransactionByHash = async function(tx_hash) {
    const query = {
        tx_hash: toBase64Rfc(tx_hash),
        include_msg_body: true,
    };

    const { data } = await http.get('getTransactionByHash', { params: query });
    return data[0];
};

/**
 * @param  {String} input_hash
 * @return {Promise<Object>}
 */
export const getTransactionByHashOrInMessageHash = async function(input_hash) {
    const byHash = await getTransactionByHash(input_hash);

    if (byHash) {
        return byHash;
    }

    return await getTransactionByInMessageHash(input_hash);
};
