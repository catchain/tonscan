import { EXTENDER_CONTRACTS_API_ENDPOINT } from '~/config.js';
import axios from 'axios';

const http = axios.create({
    baseURL: EXTENDER_CONTRACTS_API_ENDPOINT,
});

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const checkAddress = function (address) {
    return http.get(`address/${address}`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getAddressContractInfo = function (address) {
    return http.get(`address/${address}/source`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @param  {Number} options.limit
 * @param  {Number} options.offset
 * @param  {Number} options.end_utime
 * @return {Promise<Array>}
 */
export const getAddressTransactions = function (address, { limit = 50, offset = 0, end_utime }) {
    return http.get(`address/${address}/transactions`, { params: { limit, offset, end_utime } }).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const detectNft = function (address) {
    return http.get(`nft/${address}`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getNftCollectionInfo = function (address) {
    return http.get(`nft_collection/${address}`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getNftItemInfo = function (address) {
    return http.get(`nft_item/${address}`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {String}
 */
export const getNftItemPreviewUrl = function (address) {
    return `${EXTENDER_CONTRACTS_API_ENDPOINT}/nft_item/${address}/preview`;
};

/**
 * @param  {String} address
 * @param  {Number} options.limit
 * @param  {Number} options.offset
 * @return {Promise<Object>}
 */
export const getNftCollectionItems = function (address, options) {
    const { limit, offset } = options;
    const params = {
        limit: limit || 12,
        offset: offset || 0,
    };

    return http.get(`nft_collection/${address}/items`, { params }).then(({ data }) => data);
};

/**
 * @param  {String} collectionAddress
 * @param  {Number} index
 * @return {Promise<Object>}
 */
export const getNftItemByCollectionIndex = function (collectionAddress, index) {
    return getNftCollectionItems(collectionAddress, {
        limit: 1,
        offset: index - 1,
    }).then(({ items }) => items[0]);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getJettonInfo = async function (address) {
    const result = await http.get(`jetton/${address}`).then(({ data }) => data);
    return Object.freeze(result);
};

/**
 * @param  {String} address
 * @return {Promise<String>}
 */
export const getJettonRawMetadata = function getJettonUnprocessedMetadataInPlainTextFormat(address) {
    return http.get(`jetton_minter/${address}/raw_metadata`).then((response) => {
        return JSON.stringify(response.data.metadata, null, 2);
    });
};

/**
 * @param  {String} jettonAddress
 * @param  {String} userAddress
 * @return {Promise<Object>}
 */
export const getMyJettonWallet = function (jettonAddress, userAddress) {
    return http.get(`jetton_minter/${jettonAddress}/wallet/${userAddress}`).then(({ data }) => data);
};

/**
 * @param  {String} jettonAddress
 * @return {Promise<Object>}
 */
export const getJettonHolders = function (jettonAddress) {
    return http.get(`jetton_minter/${jettonAddress}/holders`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getNominatorPoolInfo = function (address) {
    return http.get(`nominator_pool/${address}`).then((response) => response.data?.nominator_pool);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getNominatorPoolNominators = function (address) {
    return http.get(`nominator_pool/${address}/nominators`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getNominatorPoolVotings = function (address) {
    return http.get(`nominator_pool/${address}/votings`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @param  {String} proposalHash
 * @return {Promise<Object>}
 */
export const getNominatorPoolVotingVotes = function (address, proposalHash) {
    return http.get(`nominator_pool/${address}/votings/${proposalHash}`).then(({ data }) => data);
};

/**
 * @param  {String} input
 * @return {Promise<Object>}
 */
export const resolveDomain = function (input) {
    const domain = input.replace(/\s/g, '');
    return http.get('dns/resolve', { params: { domain } }).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {Promise<Object>}
 */
export const getVerifiedSourceByAddress = function (address) {
    return http.get(`verifier/by-address/${address}`).then(({ data }) => data);
};

/**
 * @param  {String} address
 * @return {Promise<Array>}
 */
export const getJettonBalances = function (address) {
    return http.get(`address/${address}/jetton_wallets`).then(({ data }) => data.map(Object.freeze));
};

/**
 * @return {Promise<Object>}
 */
export const getBlockchainAddressAnal = function () {
    return http.get('blockchain/active_address_stats').then(({ data }) => Object.freeze(data));
};

/**
 * @return {Promise<Object>}
 */
export const getBlockchainMarketAnal = function () {
    return http.get('blockchain/market_stats').then(({ data }) => Object.freeze(data));
};

/**
 * @return {Promise<Object>}
 */
export const blockAnal = function () {
    return http.get('blockchain/block_stats').then(({ data }) => Object.freeze(data));
};

/**
 * @param  {String} interval
 * @return {Promise<Object>}
 */
export const getTransactionsStats = function (interval) {
    return http.get(`blockchain/transaction_stats?days=${interval}`).then(({ data }) => data);
};

/**
 * @return {Promise<Object>}
 */
export const getLockerData = function (address) {
    return http.get(`locker/${address}`).then(({ data }) => (Object.freeze(data)));
};

/**
 * @return {Promise<Object>}
 */
export const getSingleNominatorData = function (address) {
    return http.get(`nominator_pool_single/${address}`).then(({ data }) => (Object.freeze(data)));
};

/**
 * @return {Promise<Object>}
 */
export const getVestingData = function (address) {
    return http.get(`vesting_wallet/${address}`).then(({ data }) => (Object.freeze(data)));
};