import { resolveDomain } from '~/api';
import { toBase64Web } from '~/utils.js';
import { canonizeAddress, isValidAddress } from '~/tonweb.js';
import { ADDRESS_REGEX, TX_REGEX_OLD } from '~/config.js';

const TONWEB_ADDRESS_REGEX = new RegExp(`^ton://transfer/(?<address>${ADDRESS_REGEX.source})`, 'i');
const TONHUB_ADDRESS_REGEX = new RegExp(`^https://tonhub.com/transfer/(?<address>${ADDRESS_REGEX.source})`, 'i');
const TONSCAN_ADDRESS_REGEX = new RegExp(`^https://tonscan.org/address/(?<address>${ADDRESS_REGEX.source})`, 'i');
const TONWHALES_ADDRESS_REGEX = new RegExp(`^https://tonwhales.com(?:\/[a-z]{2})?/explorer/address/(?<address>${ADDRESS_REGEX.source})`, 'i');
const GETGEMS_ADDRESS_REGEX = new RegExp(`^https://getgems.io/collection/(?<address>${ADDRESS_REGEX.source})`, 'i');
const TONAPI_ADDRESS_REGEX = new RegExp(`^https://tonapi.io/account/(?<address>${ADDRESS_REGEX.source})`, 'i');

/**
 * @param  {String} input
 * @return {Boolean}
 */
export const isValidAddressCheap = (input) => ADDRESS_REGEX.test(input);

/**
 * @param  {String} input
 * @return {Boolean}
 */
export const isValidDomain = (input) => {
    return input.length >= 8 && (input.endsWith('.ton') || input.endsWith('.t.me'));
};

/**
 * @param  {String} input
 * @return {Boolean}
 */
export const isValidTxHash = (input) => {
    return (input.length === 44 && input.endsWith('=')) || input.match(/^[\da-f]{64}$/);
};

/**
 * @param  {String} input
 * @return {Promise<String|undefined>}
 */
const resolve = function resolveDomainWithRootResolver(input) {
    return resolveDomain(input)
        .then(({ address }) => address)
        .catch(e => void e);
};

/**
 * @param  {String} rawInput
 * @return {String}
 */
const removeClutter = function clearStringFromClutter(rawInput) {
    const trimmed = rawInput.trim();

    for (let regex of [
        TONWEB_ADDRESS_REGEX,
        TONSCAN_ADDRESS_REGEX,
        TONWHALES_ADDRESS_REGEX,
        TONHUB_ADDRESS_REGEX,
        GETGEMS_ADDRESS_REGEX,
        TONAPI_ADDRESS_REGEX,
        TX_REGEX_OLD,
    ]) {
        if (regex.test(trimmed)) {
            return regex.exec(trimmed)[1];
        }
    }

    return trimmed;
};

/**
 * @param  {String} input
 * @return {Promise<Object|undefined>} Route config object
 */
export async function matchInput(rawInput) {
    const input = removeClutter(rawInput);

    if (isValidTxHash(input)) {
        return {
            name: 'tx',
            params: { hash: toBase64Web(input) },
        };
    }

    else if (isValidDomain(input)) {
        const address = await resolve(input);

        return !address ? undefined : {
            name: 'address',
            params: { address },
        };
    }

    else if (isValidAddress(input)) {
        const address = canonizeAddress(input);

        return {
            name: 'address',
            params: { address },
        };
    }

    return undefined;
};

/**
 * Tries to get viable address from input.
 * @param  {String} rawInput
 * @return {Promise<String|undefined>}
 */
export async function matchAddress(rawInput) {
    const input = removeClutter(rawInput);

    if (isValidDomain(input)) {
        return await resolve(input);
    }

    return isValidAddress(input)
        ? canonizeAddress(input)
        : undefined;
};
