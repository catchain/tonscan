import { TONCENTER_API_ENDPOINT, TONCENTER_API_KEY } from '~/config.js';
import { canonizeAddress } from '~/tonweb.js';
import { dechex, hexToBase64 } from '~/utils.js';
import axiosRetry from 'axios-retry';
import axios from 'axios';

// Disable headers if api key is not set. Otherwise
// axios will make a pre-flight request:
const httpHeaders = TONCENTER_API_KEY
    ? { 'X-API-Key': TONCENTER_API_KEY }
    : undefined;

const http = axios.create({
    baseURL: TONCENTER_API_ENDPOINT,
    headers: httpHeaders,
});

axiosRetry(http, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
});

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const detectAddress = async function (address) {
    const { data } = await http.get('detectAddress', { params: { address } });

    if (!data.ok) {
        throw data.error;
    }

    return data.result;
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getAddressInfo = async function (address) {
    let result = undefined;

    try {
        const response = await http.get('getWalletInformation', { params: { address } });
        result = response.data.result;

    } catch (error) {
        if ('response' in error && !error.response.data.ok) {
            return { invalid: true };
        }

        // See ya in Sentry!
        throw error;
    }

    if (result.wallet_type == 'nominator pool v1') {
        result.wallet_type = undefined;
    }

    return Object.freeze({
        address,
        invalid: false,
        balance: result.balance,
        is_active: result.account_state === 'active',
        is_frozen: result.account_state === 'frozen',
        wallet_type: result.wallet_type || null,
        last_tx_lt: result.last_transaction_id?.lt,
        last_tx_hash: result.last_transaction_id?.hash,
    });
};

/**
 * This function extracts the data, that may be unique for every msg:
 * from (source address), to (destination address), comment and amount.
 *
 * @param  {Object} msg
 * @return {Object}
 */
const parseMessageData = function extractMessageDetails(msg) {
    const from = msg.source?.account_address || msg.source || null;
    const to = msg.destination?.account_address || msg.destination || null;

    const message = msg.msg_data?.['@type'] === 'msg.dataText'
        ? msg.message
        : null;

    return {
        from, to, message,
        amount: msg.value,
    };
};

/**
 * @param  {String} address
 * @param  {Number} lt
 * @param  {String} hash
 * @param  {Number} limit
 * @return {Promise<Array>}
 */
export const getTransactions = async function (address, lt, hash, limit = 50) {
    const query = { address, lt, hash, limit };

    const { data: { result } } = await http.get('getTransactions', { params: query });

    // @var Array[Array[Object]]
    const groups = [];

    result.forEach((tx) => {
        const is_service = !tx.in_msg && tx.out_msgs.length === 0;

        const is_external = tx.out_msgs.length == 0
            && !tx.in_msg?.source
            && tx.in_msg?.destination == address;

        const transaction_id = Object.freeze({
            lt: tx.transaction_id.lt,
            hash: tx.transaction_id.hash,
        });

        const txDetails = {
            address, is_service, is_external, transaction_id,
            is_aggregated: false,
            output_count: tx.out_msgs.length,
            timestamp: parseInt(tx.utime + '000', 10),
            fee: tx.fee,
        };

        const messages = [];

        // Don't display long message list (e.g. multisends), show aggregated info instead:
        if (tx.out_msgs.length > 10) {
            const aggregatedAmount = tx.out_msgs.reduce((total, outMsg) => parseInt(outMsg.value, 10) + total, 0);
            messages.push({
                ...txDetails,
                amount: aggregatedAmount,
                is_aggregated: true,
                from: address,
                to: 'multiple destinations', // must be truthy to indicate that we do have the destination
            });

            // Otherwise push out_msgs to the list in chronological (reverse) order:
        } else {
            tx.out_msgs.reverse().forEach((outMsg) => {
                messages.push({
                    ...txDetails,
                    ...parseMessageData(outMsg),
                });
            });
        }

        // Then push the input message:
        if (tx.in_msg?.source) {
            messages.push({
                ...txDetails,
                ...parseMessageData(tx.in_msg),
            });
        }

        // Special case when there're neither out_msgs, nor in_msg (like in system contract):
        if (is_service) {
            messages.push({
                ...txDetails,
                from: query.address,
                to: null,
            });
        }

        // Special case for external messages (e. g. when activating wallet):
        if (is_external) {
            messages.push({
                ...txDetails,
                from: null,
                to: address,
            });
        }

        groups.push(messages.map(Object.freeze));
    });

    return groups;
};

/**
 * @param  {String} options.address
 * @param  {Number} options.lt
 * @param  {String} options.hash
 * @param  {Number} options.to_lt
 * @return {Promise<Object>}
 */
export const getTransaction = async function ({ address, lt, hash, to_lt }) {
    // Convert from web format to classic:
    hash = hash.replace(/\-/g, '+').replace(/_/g, '/');

    // Hash is in hex format, API understands only base64:
    if (hash.length === 64) {
        hash = hexToBase64(hash);
    }

    const query = {
        address, lt, to_lt, hash,
        limit: 1,
    };

    const { data: { result } } = await http.get('getTransactions', { params: query });

    return Object.freeze(result.find(tx => tx.transaction_id?.hash == hash));
};

/**
 * @param  {Number} options.workchain
 * @param  {Number} options.shard
 * @param  {Number} options.seqno
 * @return {Promise<Object>}
 */
export const getBlockHeader = async function ({ workchain, shard, seqno }) {
    const query = { workchain, shard, seqno };

    const { data: { result } } = await http.get('getBlockHeader', { params: query });

    // Convert shard decimal id to hex:
    result.prev_blocks.forEach(block => block.shard = dechex(block.shard));

    return Object.freeze(result);
};

/**
 * @param  {Number} options.workchain
 * @param  {Number} options.shard
 * @param  {Number} options.seqno
 * @return {Promise<Object>}
 */
export const getBlockTransactions = async function ({ workchain, shard, seqno }) {
    const query = { workchain, shard, seqno };

    const { data: { result } } = await http.get('getBlockTransactions', { params: query });

    // Convert address hex notation to base64:
    result.transactions.forEach(tx => tx.account = canonizeAddress(tx.account));

    return result;
};

/**
 * @param  {Number} options.seqno
 * @return {Promise<Object>}
 */
export const getShards = async function ({ seqno }) {
    const { data: { result } } = await http.get('shards', { params: { seqno } });

    // Convert shard decimal id to hex:
    result.shards.forEach(block => block.shard = dechex(block.shard));

    return result;
};

/**
 * @return {Promise<Object>}
 */
export const getLastBlock = async function () {
    const { data: { result } } = await http.get('getMasterchainInfo');

    result.last.shard = dechex(result.last.shard);

    return Object.freeze(result.last);
};